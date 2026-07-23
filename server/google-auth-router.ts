import { Hono } from "hono";
import { env } from "./lib/env";
import { getDb } from "./queries/connection";
import { localUsers } from "@db/schema";
import { eq } from "drizzle-orm";
import { signLocalToken } from "./local-auth-utils";
import { nanoid } from "nanoid";

function generateUniqueId(): string {
  // Generate RC-XXXXXXXX format (8 uppercase alphanumeric chars)
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "RC-";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const googleAuth = new Hono();

// Step 1: Redirect to Google OAuth consent screen
googleAuth.get("/api/auth/google", (c) => {
  const clientId = import.meta.env?.VITE_GOOGLE_CLIENT_ID || env.googleClientId;
  const redirectUri = `${new URL(c.req.url).origin}/api/auth/google/callback`;
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  return c.redirect(url.toString());
});

// Step 2: Handle Google OAuth callback
googleAuth.get("/api/auth/google/callback", async (c) => {
  const code = c.req.query("code");
  const error = c.req.query("error");

  if (error || !code) {
    return c.html(renderCallbackPage(null, error || "No authorization code received"));
  }

  try {
    const redirectUri = `${new URL(c.req.url).origin}/api/auth/google/callback`;
    const clientId = import.meta.env?.VITE_GOOGLE_CLIENT_ID || env.googleClientId;
    const clientSecret = import.meta.env?.VITE_GOOGLE_CLIENT_SECRET || env.googleClientSecret;

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
      console.error("Google token exchange failed:", errBody);
      return c.html(renderCallbackPage(null, "Failed to exchange code for token"));
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
      return c.html(renderCallbackPage(null, "Failed to fetch Google profile"));
    }

    const profile = (await profileRes.json()) as {
      id: string;
      email: string;
      name: string;
      picture: string;
    };

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
      const uniqueId = generateUniqueId();
      // Create a unique username from email or Google ID
      const baseUsername = profile.email
        ? profile.email.split("@")[0]
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

    // Return HTML page that stores token and redirects
    return c.html(renderCallbackPage(token, null));
  } catch (err: any) {
    console.error("Google OAuth error:", err);
    return c.html(renderCallbackPage(null, "An error occurred during authentication"));
  }
});

function renderCallbackPage(token: string | null, error: string | null): string {
  if (error) {
    return `<!DOCTYPE html>
<html>
<head><title>Login Failed</title></head>
<body style="font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f8f7f5">
  <div style="text-align:center;max-width:400px;padding:40px;background:white;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.1)">
    <h2 style="color:#dc2626;margin-bottom:12px">Login Failed</h2>
    <p style="color:#6b7280">${error}</p>
    <a href="/login" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#FF6B1A;color:white;border-radius:8px;text-decoration:none">Try Again</a>
  </div>
</body>
</html>`;
  }

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
    localStorage.setItem("local_auth_token", "${token}");
    window.location.href = "/";
  </script>
</body>
</html>`;
}

export { googleAuth };
