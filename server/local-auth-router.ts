import { z } from "zod";
import { createRouter, publicQuery } from "./middleware.js";
import { getDb } from "./queries/connection.js";
import { localUsers } from "../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signLocalToken, verifyLocalToken } from "./local-auth-utils.js";
import { TRPCError } from "@trpc/server";

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
        username: z.string().min(3).max(50),
        password: z.string().min(6).max(100),
        displayName: z.string().optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ input }) => {
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

        return { token, uniqueId: result[0].uniqueId, success: true };
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
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      console.log("[LocalAuth] Login attempt for:", input.username);

      try {
        const user = await db.query.localUsers.findFirst({
          where: eq(localUsers.username, input.username),
        });
        console.log("[LocalAuth] User found:", !!user, user ? `(id=${user.id}, role=${user.role}, authProvider=${user.authProvider})` : "");
        
        if (!user || !user.passwordHash) {
          console.warn("[LocalAuth] Login failed: user not found or no passwordHash for:", input.username);
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid username or password",
          });
        }

        const valid = await bcrypt.compare(input.password, user.passwordHash);
        if (!valid) {
          console.warn("[LocalAuth] Login failed: password mismatch for:", input.username);
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid username or password",
          });
        }

        const token = signLocalToken(user.id);
        console.log("[LocalAuth] Login successful for:", input.username, "role:", user.role);
        return { token, success: true };
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
    let token = ctx.req.headers.get("x-local-auth-token");
    if (!token) {
      const authHeader = ctx.req.headers.get("authorization");
      if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
        token = authHeader.substring(7);
      }
    }
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
    };
  }),
});
