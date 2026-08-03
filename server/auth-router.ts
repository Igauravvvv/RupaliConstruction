import * as cookie from "cookie";
import { Session } from "../contracts/constants.js";
import { getSessionCookieOptions } from "./lib/cookies.js";
import { serializeLocalAuthCookie } from "./local-auth-utils.js";
import { createRouter, authedQuery, publicQuery } from "./middleware.js";
import { z } from "zod";
import { getDb } from "./queries/connection.js";
import { users, localUsers, costCalculatorRequests, constructionLeads, contacts } from "../db/schema.js";
import { eq, or, desc } from "drizzle-orm";

function generateEstimateId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "EST-";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

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
  getMyRecords: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const email = ctx.user.email;
    const phone = ctx.user.phoneNumber;

    const conditions = [];
    if (email) conditions.push(eq(costCalculatorRequests.email, email));
    if (phone) conditions.push(eq(costCalculatorRequests.phone, phone));

    let estimates: typeof costCalculatorRequests.$inferSelect[] = [];
    let leads: typeof constructionLeads.$inferSelect[] = [];
    let inquiries: typeof contacts.$inferSelect[] = [];

    if (conditions.length > 0) {
      estimates = await db
        .select()
        .from(costCalculatorRequests)
        .where(conditions.length === 1 ? conditions[0] : or(...conditions))
        .orderBy(desc(costCalculatorRequests.createdAt));
    }

    const leadConditions = [];
    if (email) leadConditions.push(eq(constructionLeads.email, email));
    if (phone) leadConditions.push(eq(constructionLeads.phone, phone));
    if (leadConditions.length > 0) {
      leads = await db
        .select()
        .from(constructionLeads)
        .where(leadConditions.length === 1 ? leadConditions[0] : or(...leadConditions))
        .orderBy(desc(constructionLeads.createdAt));
    }

    const contactConditions = [];
    if (email) contactConditions.push(eq(contacts.email, email));
    if (phone) contactConditions.push(eq(contacts.phone, phone));
    if (contactConditions.length > 0) {
      inquiries = await db
        .select()
        .from(contacts)
        .where(contactConditions.length === 1 ? contactConditions[0] : or(...contactConditions))
        .orderBy(desc(contacts.createdAt));
    }

    return { estimates, leads, inquiries };
  }),
  saveEstimateRecord: authedQuery
    .input(
      z.object({
        city: z.string(),
        propertyType: z.string().optional(),
        plotSize: z.string(),
        floors: z.number(),
        quality: z.string(),
        estimatedCost: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const referenceId = generateEstimateId();
      
      await db.insert(costCalculatorRequests).values({
        referenceId,
        city: input.city,
        propertyType: input.propertyType || "Residential",
        plotSize: input.plotSize,
        floors: input.floors,
        quality: input.quality,
        estimatedCost: input.estimatedCost,
        name: ctx.user.name || null,
        phone: ctx.user.phoneNumber || null,
        email: ctx.user.email || null,
      });

      return { success: true, referenceId };
    }),
  updateProfile: authedQuery
    .input(
      z.object({
        name: z.string().trim().min(1).max(100).optional(),
        email: z.string().email().optional(),
        phoneNumber: z.string().trim().regex(/^\+?[0-9][0-9\s-]{7,18}$/, "Enter a valid phone number").optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user.id;

      if (ctx.user.authType === "oauth") {
        const updateData: Record<string, any> = { profileCompleted: true };
        if (input.phoneNumber !== undefined) updateData.phoneNumber = input.phoneNumber || null;
        if (input.name !== undefined) updateData.name = input.name;
        if (input.email !== undefined) updateData.email = input.email || null;

        await db
          .update(users)
          .set(updateData)
          .where(eq(users.id, userId));
      } else {
        const localId = userId - 100000;
        const localUpdateData: Record<string, any> = { profileCompleted: true };
        if (input.phoneNumber !== undefined) localUpdateData.phoneNumber = input.phoneNumber || null;
        if (input.name !== undefined) localUpdateData.displayName = input.name;
        if (input.email !== undefined) localUpdateData.email = input.email || null;

        await db
          .update(localUsers)
          .set(localUpdateData)
          .where(eq(localUsers.id, localId));
      }

      return { success: true };
    }),
});
