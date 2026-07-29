import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

vi.mock("../server/queries/connection", () => ({
  getDb: () => ({
    query: {
      localUsers: {
        findFirst: vi.fn(),
      },
    },
  }),
}));

async function loadServerApp() {
  vi.resetModules();
  return import("../server/boot");
}

describe("Vercel serverless auth entry", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL", "1");
    vi.stubEnv("APP_ID", "");
    vi.stubEnv("APP_SECRET", "");
    vi.stubEnv("LOCAL_AUTH_SECRET", "test-local-auth-secret");
    vi.stubEnv("GOOGLE_CLIENT_ID", "");
    vi.stubEnv("GOOGLE_CLIENT_SECRET", "");
    vi.stubEnv("VITE_GOOGLE_CLIENT_ID", "");
    vi.stubEnv("VITE_GOOGLE_CLIENT_SECRET", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("imports without Kimi credentials and serves the Google auth route", async () => {
    const { default: app } = await loadServerApp();

    const response = await app.request("/api/auth/google");
    const body = await response.text();

    expect(response.status).toBe(500);
    expect(body).toContain("Google sign-in is not configured.");
  });
});
