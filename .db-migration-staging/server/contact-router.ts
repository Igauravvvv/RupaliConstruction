import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware.js";
import { getDb } from "./queries/connection.js";
import { contacts } from "../db/schema.js";
import { eq, desc, gte, sql } from "drizzle-orm";

export const contactRouter = createRouter({
  submit: publicQuery
    .input(
      z.object({
        name: z.string().trim().min(1, "Name is required").max(100),
        email: z.string().email("Valid email is required"),
        phone: z.string().trim().max(20).optional(),
        city: z.string().trim().max(100).optional(),
        service: z.string().trim().max(100).optional(),
        budget: z.string().trim().max(100).optional(),
        message: z.string().trim().max(5000).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(contacts).values({
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        city: input.city || null,
        service: input.service || null,
        budget: input.budget || null,
        message: input.message || null,
      });
      return { success: true, message: "Thank you! We will contact you soon." };
    }),

  list: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "read", "replied", "archived"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(contacts)
        .set({ status: input.status })
        .where(eq(contacts.id, input.id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(contacts).where(eq(contacts.id, input.id));
      return { success: true };
    }),

  stats: adminQuery.query(async () => {
    const db = getDb();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const [counts] = await db.select({
      total: sql<number>`count(*)`,
      new: sql<number>`count(*) filter (where ${contacts.status} = 'new')`,
      read: sql<number>`count(*) filter (where ${contacts.status} = 'read')`,
      replied: sql<number>`count(*) filter (where ${contacts.status} = 'replied')`,
      archived: sql<number>`count(*) filter (where ${contacts.status} = 'archived')`,
      today: sql<number>`count(*) filter (where ${contacts.createdAt} >= ${today})`,
      thisWeek: sql<number>`count(*) filter (where ${contacts.createdAt} >= ${weekAgo})`,
    }).from(contacts);
    return {
      total: Number(counts?.total ?? 0), new: Number(counts?.new ?? 0), read: Number(counts?.read ?? 0),
      replied: Number(counts?.replied ?? 0), archived: Number(counts?.archived ?? 0),
      today: Number(counts?.today ?? 0), thisWeek: Number(counts?.thisWeek ?? 0),
    };
  }),
});
