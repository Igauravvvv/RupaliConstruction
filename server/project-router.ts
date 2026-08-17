import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware.js";
import { getDb } from "./queries/connection.js";
import { projects } from "../db/schema.js";
import { eq, desc, and, sql } from "drizzle-orm";

function withoutProjectCost<T extends { cost?: unknown }>(project: T) {
  const { cost: _cost, ...publicProject } = project;
  return publicProject;
}

export const projectRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          type: z.enum(["residential", "commercial", "renovation", "interior"]).optional(),
          status: z.enum(["ongoing", "completed"]).optional(),
          featured: z.boolean().optional(),
          limit: z.number().min(1).max(50).default(10),
          offset: z.number().min(0).default(0),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions: any[] = [];

      if (input?.type) conditions.push(eq(projects.type, input.type));
      if (input?.status) conditions.push(eq(projects.status, input.status));
      if (input?.featured !== undefined) conditions.push(eq(projects.featured, input.featured));

      const where = conditions.length > 1 ? and(...conditions) : conditions[0];

      const items = where
        ? await db
            .select()
            .from(projects)
            .where(where)
            .orderBy(desc(projects.createdAt))
            .limit(input?.limit || 10)
            .offset(input?.offset || 0)
        : await db
            .select()
            .from(projects)
            .orderBy(desc(projects.createdAt))
            .limit(input?.limit || 10)
            .offset(input?.offset || 0);

      const countResult = where
        ? await db.select({ count: sql<number>`count(*)` }).from(projects).where(where)
        : await db.select({ count: sql<number>`count(*)` }).from(projects);
      return {
        items: items.map(withoutProjectCost),
        total: Number(countResult[0]?.count ?? 0),
      };
    }),

  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const project = await db.query.projects.findFirst({
        where: eq(projects.slug, input.slug),
      });
      return project ? withoutProjectCost(project) : undefined;
    }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string(),
        description: z.string().optional(),
        location: z.string().optional(),
        area: z.string().optional(),
        duration: z.string().optional(),
        type: z.enum(["residential", "commercial", "renovation", "interior"]).default("residential"),
        status: z.enum(["ongoing", "completed"]).default("completed"),
        images: z.string().optional(),
        featured: z.boolean().default(false),
        completionDate: z.string().optional(),
        cost: z.string().optional(),
        reviewerName: z.string().max(120).optional(),
        reviewerRole: z.string().max(160).optional(),
        reviewText: z.string().max(5000).optional(),
        instagramVideoUrl: z.string().url().optional().or(z.literal("")),
        processSteps: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(projects).values(input).returning({ id: projects.id });
      return { id: result[0]?.id, success: true };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        location: z.string().optional(),
        area: z.string().optional(),
        duration: z.string().optional(),
        type: z.enum(["residential", "commercial", "renovation", "interior"]).optional(),
        status: z.enum(["ongoing", "completed"]).optional(),
        images: z.string().optional(),
        featured: z.boolean().optional(),
        completionDate: z.string().optional(),
        cost: z.string().optional(),
        reviewerName: z.string().max(120).optional(),
        reviewerRole: z.string().max(160).optional(),
        reviewText: z.string().max(5000).optional(),
        instagramVideoUrl: z.string().url().optional().or(z.literal("")),
        processSteps: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const db = getDb();
      await db.update(projects).set(data).where(eq(projects.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(projects).where(eq(projects.id, input.id));
      return { success: true };
    }),
});
