import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import bcrypt from "bcryptjs";
import * as cookie from "cookie";

const findFirst = vi.fn();
const insertValues = vi.fn();

vi.mock("../server/queries/connection", () => ({
  getDb: () => ({
    query: {
      localUsers: {
        findFirst,
      },
    },
    insert: () => ({
      values: insertValues,
    }),
    update: () => ({
      set: () => ({ where: vi.fn() }),
    }),
  }),
}));

function resetAuthEnv() {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("LOCAL_AUTH_SECRET", "test-local-auth-secret");
  vi.stubEnv("APP_SECRET", "");
}

async function createCaller(localAuthCookie?: string) {
  vi.resetModules();
  const { appRouter } = await import("../server/router.js");
  return appRouter.createCaller({
    req: new Request("https://rupali.example/api/trpc", {
      headers: localAuthCookie ? { cookie: localAuthCookie } : undefined,
    }),
    resHeaders: new Headers(),
  });
}

describe("local password auth", () => {
  beforeEach(() => {
    resetAuthEnv();
    findFirst.mockReset();
    insertValues.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("logs in with a valid username and password and sets an HttpOnly session cookie", async () => {
    const passwordHash = await bcrypt.hash("correct-password", 4);
    const dbUser = {
      id: 3,
      uniqueId: "RC-USER0003",
      username: "client",
      passwordHash,
      displayName: "Client User",
      email: "client@example.com",
      role: "user",
      avatar: null,
      phoneNumber: "+919999999999",
      googleId: null,
      authProvider: "local",
    };

    findFirst.mockResolvedValueOnce(dbUser);
    const resHeaders = new Headers();
    const { appRouter } = await import("../server/router.js");
    const caller = appRouter.createCaller({
      req: new Request("https://rupali.example/api/trpc"),
      resHeaders,
    });

    const result = await caller.localAuth.login({
      username: "client",
      password: "correct-password",
    });

    expect(result.success).toBe(true);
    const authCookie = cookie.parse(resHeaders.get("set-cookie") || "").rc_local_auth;
    expect(authCookie).toEqual(expect.any(String));
    expect(resHeaders.get("set-cookie")).toContain("HttpOnly");
    expect(resHeaders.get("set-cookie")).toContain("Secure");

    findFirst.mockResolvedValueOnce(dbUser);
    const authedCaller = await createCaller(cookie.serialize("rc_local_auth", authCookie));
    await expect(authedCaller.localAuth.me()).resolves.toMatchObject({
      id: 100003,
      name: "Client User",
      email: "client@example.com",
      authType: "local",
      phoneNumber: "+919999999999",
    });
  });

  it("rejects an invalid password without issuing a token", async () => {
    const passwordHash = await bcrypt.hash("correct-password", 4);
    findFirst.mockResolvedValueOnce({
      id: 4,
      username: "client",
      passwordHash,
      displayName: "Client User",
      email: "client@example.com",
      role: "user",
    });
    const caller = await createCaller();

    await expect(
      caller.localAuth.login({
        username: "client",
        password: "wrong-password",
      }),
    ).rejects.toMatchObject({
      code: "UNAUTHORIZED",
      message: "Invalid username or password",
    });
  });

  it("fails explicitly in production when no JWT secret is configured", async () => {
    vi.stubEnv("LOCAL_AUTH_SECRET", "");
    vi.stubEnv("APP_SECRET", "");
    const passwordHash = await bcrypt.hash("correct-password", 4);
    findFirst.mockResolvedValueOnce({
      id: 5,
      username: "client",
      passwordHash,
      displayName: "Client User",
      email: "client@example.com",
      role: "user",
    });
    const caller = await createCaller();

    await expect(
      caller.localAuth.login({
        username: "client",
        password: "correct-password",
      }),
    ).rejects.toMatchObject({
      code: "INTERNAL_SERVER_ERROR",
      message: "Login failed due to a server error. Please try again.",
    });
  });
});
