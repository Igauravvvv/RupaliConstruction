import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as cookie from "cookie";

type MockUser = {
  id: number;
  uniqueId: string;
  username: string;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  googleId: string | null;
  avatar: string | null;
  authProvider: "local" | "google";
  role: "user" | "admin";
};

const findFirst = vi.fn();
const updateSet = vi.fn();
const insertValues = vi.fn();

vi.mock("../server/queries/connection", () => ({
  getDb: () => ({
    query: {
      localUsers: {
        findFirst,
      },
    },
    update: () => ({
      set: updateSet,
    }),
    insert: () => ({
      values: insertValues,
    }),
  }),
}));

function resetAuthEnv() {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("APP_ID", "");
  vi.stubEnv("APP_SECRET", "");
  vi.stubEnv("LOCAL_AUTH_SECRET", "test-local-auth-secret");
  vi.stubEnv("GOOGLE_CLIENT_ID", "");
  vi.stubEnv("GOOGLE_CLIENT_SECRET", "");
  vi.stubEnv("VITE_GOOGLE_CLIENT_ID", "");
  vi.stubEnv("VITE_GOOGLE_CLIENT_SECRET", "");
  vi.stubEnv("PUBLIC_SITE_URL", "");
  vi.stubEnv("SITE_URL", "");
  vi.stubEnv("APP_URL", "");
  vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
  vi.stubEnv("VERCEL_URL", "");
  vi.stubEnv("GOOGLE_OAUTH_SCOPES", "openid email profile");
}

async function loadGoogleAuth() {
  vi.resetModules();
  return import("../server/google-auth-router.js");
}

function stateFromLocation(location: string) {
  return new URL(location).searchParams.get("state") || "";
}

describe("Google auth serverless route", () => {
  beforeEach(() => {
    resetAuthEnv();
    findFirst.mockReset();
    updateSet.mockReset();
    updateSet.mockReturnValue({ where: vi.fn() });
    insertValues.mockReset();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("does not crash in production when unrelated Kimi credentials are missing", async () => {
    await expect(loadGoogleAuth()).resolves.toHaveProperty("googleAuth");
  });

  it("returns a handled error page when Google client ID is not configured", async () => {
    const { googleAuth } = await loadGoogleAuth();

    const response = await googleAuth.request("/api/auth/google");
    const body = await response.text();

    expect(response.status).toBe(500);
    expect(body).toContain("Google sign-in is not configured.");
  });

  it("redirects to Google with the production callback URL and a safe app redirect", async () => {
    vi.stubEnv("GOOGLE_CLIENT_ID", "google-client-id");
    vi.stubEnv("PUBLIC_SITE_URL", "https://rupali.example/");

    const { googleAuth } = await loadGoogleAuth();

    const response = await googleAuth.request("/api/auth/google?redirect=%2Fadmin");
    const location = response.headers.get("location");
    const setCookie = response.headers.get("set-cookie") || "";

    expect(response.status).toBe(302);
    expect(location).toBeTruthy();

    const googleUrl = new URL(location!);
    expect(googleUrl.origin).toBe("https://accounts.google.com");
    expect(googleUrl.searchParams.get("client_id")).toBe("google-client-id");
    expect(googleUrl.searchParams.get("redirect_uri")).toBe(
      "https://rupali.example/api/auth/google/callback",
    );
    expect(googleUrl.searchParams.get("scope")).toBe("openid email profile");

    const state = stateFromLocation(location!);
    const stateCookie = cookie.parse(setCookie).google_oauth_state;
    expect(stateCookie).toBe(state);

    const decodedState = JSON.parse(Buffer.from(state, "base64url").toString("utf8"));
    expect(decodedState.redirect).toBe("/admin");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("Secure");
    expect(setCookie).toContain("SameSite=Lax");
  });

  it("sanitizes unsafe redirect paths before putting them into OAuth state", async () => {
    vi.stubEnv("GOOGLE_CLIENT_ID", "google-client-id");
    vi.stubEnv("PUBLIC_SITE_URL", "rupali.example");

    const { googleAuth } = await loadGoogleAuth();

    const response = await googleAuth.request("/api/auth/google?redirect=https%3A%2F%2Fevil.example");
    const location = response.headers.get("location")!;
    const state = stateFromLocation(location);
    const decodedState = JSON.parse(Buffer.from(state, "base64url").toString("utf8"));

    expect(new URL(location).searchParams.get("redirect_uri")).toBe(
      "https://rupali.example/api/auth/google/callback",
    );
    expect(decodedState.redirect).toBe("/");
  });

  it("rejects a callback when the returned state does not match the cookie", async () => {
    vi.stubEnv("GOOGLE_CLIENT_ID", "google-client-id");
    vi.stubEnv("GOOGLE_CLIENT_SECRET", "google-client-secret");

    const { googleAuth } = await loadGoogleAuth();

    const response = await googleAuth.request("/api/auth/google/callback?code=abc&state=returned", {
      headers: {
        cookie: "google_oauth_state=expected",
      },
    });
    const body = await response.text();

    expect(response.status).toBe(400);
    expect(body).toContain("Google sign-in expired. Please try again.");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("returns a handled 502 page when Google token exchange fails", async () => {
    vi.stubEnv("GOOGLE_CLIENT_ID", "google-client-id");
    vi.stubEnv("GOOGLE_CLIENT_SECRET", "google-client-secret");

    const { googleAuth } = await loadGoogleAuth();
    const start = await googleAuth.request("/api/auth/google");
    const location = start.headers.get("location")!;
    const state = stateFromLocation(location);
    const cookieHeader = cookie.serialize("google_oauth_state", state);

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response("redirect_uri_mismatch", { status: 400 }),
    );

    const response = await googleAuth.request(
      `/api/auth/google/callback?code=abc&state=${encodeURIComponent(state)}`,
      { headers: { cookie: cookieHeader } },
    );
    const body = await response.text();

    expect(response.status).toBe(502);
    expect(body).toContain("Google sign-in failed during token exchange.");
    expect(findFirst).not.toHaveBeenCalled();
  });

  it("signs in an existing Google user and redirects without requiring profile completion", async () => {
    vi.stubEnv("GOOGLE_CLIENT_ID", "google-client-id");
    vi.stubEnv("GOOGLE_CLIENT_SECRET", "google-client-secret");
    vi.stubEnv("PUBLIC_SITE_URL", "https://rupali.example");

    const user: MockUser = {
      id: 7,
      uniqueId: "RC-USER0007",
      username: "client",
      displayName: "Client User",
      email: "client@example.com",
      phoneNumber: "+919999999999",
      googleId: "google-user-id",
      avatar: null,
      authProvider: "google",
      role: "user",
    };

    findFirst.mockResolvedValueOnce(user);
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        Response.json({ access_token: "google-access-token" }),
      )
      .mockResolvedValueOnce(
        Response.json({
        id: "google-user-id",
        email: "client@example.com",
        verified_email: true,
        name: "Client User",
          picture: "https://example.com/avatar.png",
        }),
      );

    const { googleAuth } = await loadGoogleAuth();
    const start = await googleAuth.request("/api/auth/google?redirect=%2Fadmin");
    const state = stateFromLocation(start.headers.get("location")!);

    const response = await googleAuth.request(
      `/api/auth/google/callback?code=abc&state=${encodeURIComponent(state)}`,
      { headers: { cookie: cookie.serialize("google_oauth_state", state) } },
    );
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).not.toContain("localStorage");
    expect(body).toContain('window.location.replace("/admin")');
    expect(response.headers.get("set-cookie")).toContain("rc_local_auth=");
    expect(insertValues).not.toHaveBeenCalled();

    const tokenRequestBody = vi.mocked(fetch).mock.calls[0][1]?.body as URLSearchParams;
    expect(tokenRequestBody.get("redirect_uri")).toBe(
      "https://rupali.example/api/auth/google/callback",
    );
  });
});
