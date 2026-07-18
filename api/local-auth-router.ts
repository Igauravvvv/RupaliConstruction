import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { localUsers } from "@db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signLocalToken, verifyLocalToken } from "./local-auth-utils";
import { TRPCError } from "@trpc/server";

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

      const result = await db.insert(localUsers).values({
        username: input.username,
        passwordHash,
        displayName: input.displayName || input.username,
        email: input.email || null,
        role: "admin",
      }).returning({ id: localUsers.id });

      const userId = result[0].id;
      const token = signLocalToken(userId);

      return { token, success: true };
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
      console.log("Login attempt for:", input.username);

      try {
        const user = await db.query.localUsers.findFirst({
          where: eq(localUsers.username, input.username),
        });
        console.log("User query result:", !!user);
        
        if (!user) {
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
        console.log("Login successful");
        return { token, success: true };
      } catch (err: any) {
        console.error("Error during login:", err);
        throw err;
      }
    }),

  me: publicQuery.query(async ({ ctx }) => {
    const token = ctx.req.headers.get("x-local-auth-token");
    if (!token) return null;

    const user = await verifyLocalToken(token);
    if (!user) return null;

    return {
      id: user.id + 100000,
      name: user.displayName || user.username,
      username: user.username,
      email: user.email,
      role: user.role,
      authType: "local" as const,
    };
  }),
});
