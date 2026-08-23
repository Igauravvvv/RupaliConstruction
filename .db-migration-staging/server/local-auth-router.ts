import { z } from "zod";
import { createRouter, publicQuery } from "./middleware.js";
import { getDb } from "./queries/connection.js";
import { localUsers } from "../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { LOCAL_AUTH_COOKIE, serializeLocalAuthCookie, signLocalToken, verifyLocalToken } from "./local-auth-utils.js";
import { TRPCError } from "@trpc/server";
import * as cookie from "cookie";

function generateUniqueId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "RC-";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const localAuthRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        username: z.string().trim().min(3).max(50).regex(/^[a-zA-Z0-9._-]+$/, "Username contains unsupported characters"),
        password: z.string().min(12).max(128),
        displayName: z.string().trim().min(1).max(100).optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();

      try {
        // Check if username exists
        const existing = await db.query.localUsers.findFirst({
          where: eq(localUsers.username, input.username),
        });
        if (existing) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Username already exists",
          });
        }

        const passwordHash = await bcrypt.hash(input.password, 12);
        const uniqueId = generateUniqueId();

        const result = await db.insert(localUsers).values({
          uniqueId,
          username: input.username,
          passwordHash,
          displayName: input.displayName || input.username,
          email: input.email || null,
          authProvider: "local",
          role: "user",
        }).returning({ id: localUsers.id, uniqueId: localUsers.uniqueId });

        const userId = result[0].id;
        const token = signLocalToken(userId);
        ctx.resHeaders.append("set-cookie", serializeLocalAuthCookie(token));

        return { uniqueId: result[0].uniqueId, success: true };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        console.error("[LocalAuth] Unexpected error during registration:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Registration failed due to a server error. Please try again.",
        });
      }
    }),

  login: publicQuery
    .input(
      z.object({
        username: z.string().trim().min(3).max(50),
        password: z.string().min(1).max(128),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();

      try {
        const user = await db.query.localUsers.findFirst({
          where: eq(localUsers.username, input.username),
        });
        if (!user || !user.passwordHash) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid username or password",
          });
        }

        const valid = await bcrypt.compare(input.password, user.passwordHash);
        if (!valid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid username or password",
          });
        }

        const token = signLocalToken(user.id);
        
        await db.update(localUsers)
          .set({ lastSignInAt: new Date() })
          .where(eq(localUsers.id, user.id));

        ctx.resHeaders.append("set-cookie", serializeLocalAuthCookie(token));
        return { success: true, uniqueId: user.uniqueId };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        console.error("[LocalAuth] Unexpected error during login:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Login failed due to a server error. Please try again.",
        });
      }
    }),

  me: publicQuery.query(async ({ ctx }) => {
    const token = cookie.parse(ctx.req.headers.get("cookie") || "")[LOCAL_AUTH_COOKIE];
    if (!token) return null;

    const user = await verifyLocalToken(token);
    if (!user) return null;

    return {
      id: user.id + 100000,
      name: user.displayName || user.username,
      username: user.username,
      email: user.email,
      role: user.role,
      uniqueId: user.uniqueId,
      avatar: user.avatar,
      authType: "local" as const,
      phoneNumber: user.phoneNumber,
      profileCompleted: user.profileCompleted,
    };
  }),
});
