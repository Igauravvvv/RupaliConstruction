import * as cookie from "cookie";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, authedQuery } from "./middleware";
import { z } from "zod";
import { getDb } from "./queries/connection";
import { users, localUsers } from "@db/schema";
import { eq } from "drizzle-orm";

export const authRouter = createRouter({
  me: authedQuery.query((opts) => opts.ctx.user),
  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );
    return { success: true };
  }),
  updateProfile: authedQuery
    .input(z.object({ phoneNumber: z.string().min(10) }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      if (ctx.user.authType === "oauth") {
        await db.update(users).set({ phoneNumber: input.phoneNumber }).where(eq(users.id, ctx.user.id));
      } else {
        await db.update(localUsers).set({ phoneNumber: input.phoneNumber }).where(eq(localUsers.id, ctx.user.id - 100000));
      }
      return { success: true };
    }),
});
