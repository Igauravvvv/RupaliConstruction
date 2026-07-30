import { Hono } from "hono";
import * as cookie from "cookie";
import { env } from "./lib/env.js";
import { getDb } from "./queries/connection.js";
import { localUsers } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { signLocalToken } from "./local-auth-utils.js";
import { nanoid } from "nanoid";

const GOOGLE_STATE_COOKIE = "google_oauth_state";
const GOOGLE_STATE_MAX_AGE_SECONDS = 10 * 60;

type GoogleOAuthState = {
  nonce: string;
  redirect: string;
};

function generateUniqueIdValue(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "RC-";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function generateUniqueId(db: ReturnType<typeof getDb>): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const uniqueId = generateUniqueIdValue();
    const existing = await db.query.localUsers.findFirst({
      where: eq(localUsers.uniqueId, uniqueId),
    });
    if (!existing) return uniqueId;
  }
  return `RC-${nanoid(10).toUpperCase().replace(/[^A-Z0-9]/g, "0").slice(0, 8)}`;
}

function getGoogleClientConfig() {
  const e = process.env;
  return {
    clientId: e.GOOGLE_CLIENT_ID || e.VITE_GOOGLE_CLIENT_ID || env.googleClientId,
    clientSecret: e.GOOGLE_CLIENT_SECRET || e.VITE_GOOGLE_CLIENT_SECRET || env.googleClientSecret,
  };
}

function normalizeBaseUrl(value?: string): string {
  const trimmed = value?.trim().replace(/\/+$/, "");
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function getBaseUrl(req: Request): string {
  const configured = normalizeBaseUrl(
    process.env.PUBLIC_SITE_URL ||
      process.env.SITE_URL ||
      process.env.APP_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      process.env.VERCEL_URL,
  );
  if (configured) return configured;

  const forwardedHost = req.headers.get("x-forwarded-host");
  if (forwardedHost) {
    const forwardedProto = req.headers.get("x-forwarded-proto") || "https";
    return `${forwardedProto}://${forwardedHost}`;
  }

  return new URL(req.url).origin;
}

function sanitizeRedirectPath(value: string | null | undefined): string {
  if (!value) return "/";

  let redirectPath = value;
  try {
    redirectPath = decodeURIComponent(value);
  } catch {
    redirectPath = value;
  }

  if (
    !redirectPath.startsWith("/") ||
    redirectPath.startsWith("//") ||
    redirectPath.startsWith("/\\") ||
    /[\r\n]/.test(redirectPath)
  ) {
    return "/";
  }

  return redirectPath;
}

function encodeState(state: GoogleOAuthState): string {
  return Buffer.from(JSON.stringify(state), "utf8").toString("base64url");
}

function decodeState(value: string): GoogleOAuthState | null {
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
    if (
      parsed &&
      typeof parsed.nonce === "string" &&
      parsed.nonce.length >= 16 &&
      typeof parsed.redirect === "string"
    ) {
      return {
        nonce: parsed.nonce,
        redirect: sanitizeRedirectPath(parsed.redirect),
      };
    }
  } catch {
    // Invalid OAuth state.
  }
  return null;
}

function getStateCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "lax" as const,
    secure: env.isProduction,
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function slugifyUsername(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "_")
    .replace(/^[_-]+|[_-]+$/g, "")
    .slice(0, 50);
  return slug || `google_${nanoid(8)}`;
}

const googleAuth = new Hono();

// Step 1: Redirect to Google OAuth consent screen
googleAuth.get("/api/auth/google", (c) => {
  const { clientId } = getGoogleClientConfig();
  console.log("[GoogleAuth] /api/auth/google hit. clientId present:", !!clientId);
  if (!clientId) {
    console.error("[GoogleAuth] GOOGLE_CLIENT_ID is not set. Google sign-in disabled.");
    return c.html(renderCallbackPage(null, "Google sign-in is not configured.", "/login"), 500);
  }

  const baseUrl = getBaseUrl(c.req.raw);
  const redirectUri = `${baseUrl}/api/auth/google/callback`;
  console.log("[GoogleAuth] Computed baseUrl:", baseUrl);
  console.log("[GoogleAuth] Computed redirectUri:", redirectUri);
  const redirect = sanitizeRedirectPath(c.req.query("redirect"));
  const state = encodeState({ nonce: nanoid(24), redirect });
  const scopes = process.env.GOOGLE_OAUTH_SCOPES || "openid email profile";

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", scopes);
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "select_account");
  url.searchParams.set("include_granted_scopes", "true");

  c.header(
    "Set-Cookie",
    cookie.serialize(
      GOOGLE_STATE_COOKIE,
      state,
      getStateCookieOptions(GOOGLE_STATE_MAX_AGE_SECONDS),
    ),
  );

  return c.redirect(url.toString());
});

// Step 2: Handle Google OAuth callback
googleAuth.get("/api/auth/google/callback", async (c) => {
  const code = c.req.query("code");
  const error = c.req.query("error");
  const returnedState = c.req.query("state");
  const cookies = cookie.parse(c.req.header("cookie") || "");
  const expectedState = cookies[GOOGLE_STATE_COOKIE];

  c.header(
    "Set-Cookie",
    cookie.serialize(GOOGLE_STATE_COOKIE, "", getStateCookieOptions(0)),
  );

  if (error || !code) {
    console.error("[GoogleAuth] Callback returned without an auth code:", { error, hasCode: !!code });
    return c.html(renderCallbackPage(null, error || "No authorization code received", "/login"));
  }

  if (!returnedState || !expectedState || returnedState !== expectedState) {
    console.error("[GoogleAuth] OAuth state mismatch:", {
      hasReturnedState: !!returnedState,
      hasExpectedState: !!expectedState,
    });
    return c.html(renderCallbackPage(null, "Google sign-in expired. Please try again.", "/login"), 400);
  }

  const decodedState = decodeState(returnedState);
  if (!decodedState) {
    console.error("[GoogleAuth] OAuth state could not be decoded.");
    return c.html(renderCallbackPage(null, "Google sign-in could not be verified.", "/login"), 400);
  }

  try {
    const baseUrl = getBaseUrl(c.req.raw);
    const redirectUri = `${baseUrl}/api/auth/google/callback`;
    const { clientId, clientSecret } = getGoogleClientConfig();

    console.log("[GoogleAuth] Callback: baseUrl =", baseUrl);
    console.log("[GoogleAuth] Callback: redirectUri =", redirectUri);
    console.log("[GoogleAuth] Callback: clientId present =", !!clientId, "clientSecret present =", !!clientSecret);

    if (!clientId || !clientSecret) {
      console.error("[GoogleAuth] Missing clientId or clientSecret in callback.");
      return c.html(renderCallbackPage(null, "Google sign-in is not configured.", "/login"), 500);
    }

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      console.error("[GoogleAuth] Token exchange failed. Status:", tokenRes.status, "Body:", errBody);
      console.error("[GoogleAuth] redirect_uri used:", redirectUri);
      return c.html(renderCallbackPage(null, "Google sign-in failed during token exchange.", "/login"), 502);
    }

    const tokens = (await tokenRes.json()) as {
      access_token: string;
      id_token?: string;
    };

    // Fetch user profile from Google
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!profileRes.ok) {
      const errBody = await profileRes.text();
      console.error("[GoogleAuth] Failed to fetch Google profile. Status:", profileRes.status, "Body:", errBody);
      return c.html(renderCallbackPage(null, "Failed to fetch Google profile.", "/login"), 502);
    }

    const profile = (await profileRes.json()) as {
      id: string;
      email: string;
      name: string;
      picture: string;
    };

    let phoneNumber = null;
    if ((process.env.GOOGLE_OAUTH_SCOPES || "").includes("user.phonenumbers.read")) {
      try {
        const peopleRes = await fetch("https://people.googleapis.com/v1/people/me?personFields=phoneNumbers", {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        });
        if (peopleRes.ok) {
          const peopleData = await peopleRes.json();
          if (peopleData.phoneNumbers && peopleData.phoneNumbers.length > 0) {
            phoneNumber = peopleData.phoneNumbers[0].value;
          }
        }
      } catch (e) {
        console.error("[GoogleAuth] Failed to fetch phone number from Google:", e);
      }
    }

    const db = getDb();

    // Check if user already exists by Google ID
    let user = await db.query.localUsers.findFirst({
      where: eq(localUsers.googleId, profile.id),
    });

    if (!user) {
      // Check if user exists by email
      if (profile.email) {
        user = await db.query.localUsers.findFirst({
          where: eq(localUsers.email, profile.email),
        });

        if (user) {
          // Link Google ID to existing user
          await db
            .update(localUsers)
            .set({
              googleId: profile.id,
              avatar: profile.picture || user.avatar,
              phoneNumber: phoneNumber || user.phoneNumber,
              authProvider: "google",
              updatedAt: new Date(),
            })
            .where(eq(localUsers.id, user.id));
          user = await db.query.localUsers.findFirst({
            where: eq(localUsers.id, user.id),
          });
        }
      }
    }

    if (!user) {
      // Create new user
      const uniqueId = await generateUniqueId(db);
      const baseUsername = profile.email
        ? slugifyUsername(profile.email.split("@")[0])
        : `google_${profile.id}`;

      // Ensure username uniqueness
      let username = baseUsername;
      let counter = 1;
      while (true) {
        const existing = await db.query.localUsers.findFirst({
          where: eq(localUsers.username, username),
        });
        if (!existing) break;
        username = `${baseUsername}_${counter}`;
        counter++;
      }

      const result = await db
        .insert(localUsers)
        .values({
          uniqueId,
          username,
          displayName: profile.name,
          email: profile.email,
          phoneNumber,
          googleId: profile.id,
          avatar: profile.picture,
          authProvider: "google",
          passwordHash: null,
          role: "user",
        })
        .returning();

      user = result[0];
    }

    // Sign JWT
    const token = signLocalToken(user!.id);
    const redirectPath = user!.phoneNumber
      ? decodedState.redirect
      : `/complete-profile?redirect=${encodeURIComponent(decodedState.redirect)}`;

    // Return HTML page that stores token and redirects
    return c.html(renderCallbackPage(token, null, redirectPath));
  } catch (err) {
    console.error("[GoogleAuth] OAuth error:", err);
    return c.html(renderCallbackPage(null, "An error occurred during authentication.", "/login"), 500);
  }
});

function renderCallbackPage(token: string | null, error: string | null, redirectPath: string): string {
  if (error) {
    const safeError = escapeHtml(error);
    const safeRedirectPath = escapeHtml(sanitizeRedirectPath(redirectPath));
    return `<!DOCTYPE html>
<html>
<head><title>Login Failed</title></head>
<body style="font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f8f7f5">
  <div style="text-align:center;max-width:400px;padding:40px;background:white;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.1)">
    <h2 style="color:#dc2626;margin-bottom:12px">Login Failed</h2>
    <p style="color:#6b7280">${safeError}</p>
    <a href="${safeRedirectPath}" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#FF6B1A;color:white;border-radius:8px;text-decoration:none">Try Again</a>
  </div>
</body>
</html>`;
  }

  const serializedToken = JSON.stringify(token);
  const serializedRedirect = JSON.stringify(sanitizeRedirectPath(redirectPath));

  return `<!DOCTYPE html>
<html>
<head><title>Signing in...</title></head>
<body style="font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f8f7f5">
  <div style="text-align:center">
    <div style="width:48px;height:48px;border:4px solid #e5e7eb;border-top-color:#FF6B1A;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 20px"></div>
    <p style="color:#6b7280">Signing you in...</p>
  </div>
  <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
  <script>
    localStorage.setItem("local_auth_token", ${serializedToken});
    window.location.replace(${serializedRedirect});
  </script>
</body>
</html>`;
}

export { googleAuth };
