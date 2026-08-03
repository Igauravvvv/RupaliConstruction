import * as cookie from "cookie";
import { Session } from "../contracts/constants.js";
import { getSessionCookieOptions } from "./lib/cookies.js";
import { serializeLocalAuthCookie } from "./local-auth-utils.js";
import { createRouter, authedQuery, publicQuery } from "./middleware.js";
import { z } from "zod";
import { getDb } from "./queries/connection.js";
import { users, localUsers } from "../db/schema.js";
import { eq } from "drizzle-orm";


export const authRouter = createRouter({
  me: authedQuery.query((opts) => opts.ctx.user),
  logout: publicQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      })
    );
    ctx.resHeaders.append("set-cookie", serializeLocalAuthCookie("", 0));
    return { success: true };
  }),
  updateProfile: authedQuery
    .input(
      z.object({
        phoneNumber: z.string().trim().regex(/^\+?[0-9][0-9\s-]{7,18}$/, "Enter a valid phone number").optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user.id;

      if (ctx.user.authType === "oauth") {
        await db
          .update(users)
          .set({ 
            phoneNumber: input.phoneNumber || null,
            profileCompleted: true
          })
          .where(eq(users.id, userId));
      } else {
        const localId = userId - 100000;
        await db
          .update(localUsers)
          .set({ 
            phoneNumber: input.phoneNumber || null,
            profileCompleted: true
          })
          .where(eq(localUsers.id, localId));
      }

      return { success: true };
    }),
});
