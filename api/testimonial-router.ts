import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { testimonials } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const testimonialRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          featured: z.boolean().optional(),
          limit: z.number().min(1).max(50).default(10),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const where = input?.featured ? eq(testimonials.featured, true) : undefined;

      const items = where
        ? await db
            .select()
            .from(testimonials)
            .where(where)
            .orderBy(desc(testimonials.createdAt))
            .limit(input?.limit || 10)
        : await db
            .select()
            .from(testimonials)
            .orderBy(desc(testimonials.createdAt))
            .limit(input?.limit || 10);

      return items;
    }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        location: z.string().optional(),
        project: z.string().optional(),
        rating: z.number().min(1).max(5).default(5),
        content: z.string(),
        image: z.string().optional(),
        featured: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(testimonials).values(input);
      return { id: Number(result[0]?.insertId), success: true };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        location: z.string().optional(),
        project: z.string().optional(),
        rating: z.number().min(1).max(5).optional(),
        content: z.string().optional(),
        image: z.string().optional(),
        featured: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const db = getDb();
      await db.update(testimonials).set(data).where(eq(testimonials.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(testimonials).where(eq(testimonials.id, input.id));
      return { success: true };
    }),
});
