import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { blogPosts } from "@db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
export const blogRouter = createRouter({
    list: publicQuery
        .input(z
        .object({
        category: z.string().optional(),
        featured: z.boolean().optional(),
        limit: z.number().min(1).max(50).default(10),
        offset: z.number().min(0).default(0),
    })
        .optional())
        .query(async ({ input }) => {
        const db = getDb();
        const conditions = [eq(blogPosts.published, true)];
        if (input?.category) {
            conditions.push(eq(blogPosts.category, input.category));
        }
        if (input?.featured) {
            conditions.push(eq(blogPosts.featured, true));
        }
        const where = conditions.length > 1 ? and(...conditions) : conditions[0];
        const items = await db
            .select()
            .from(blogPosts)
            .where(where)
            .orderBy(desc(blogPosts.createdAt))
            .limit(input?.limit || 10)
            .offset(input?.offset || 0);
        const countResult = await db
            .select({ count: sql `count(*)` })
            .from(blogPosts)
            .where(where);
        return {
            items,
            total: countResult[0]?.count || 0,
        };
    }),
    bySlug: publicQuery
        .input(z.object({ slug: z.string() }))
        .query(async ({ input }) => {
        const db = getDb();
        const post = await db.query.blogPosts.findFirst({
            where: and(eq(blogPosts.slug, input.slug), eq(blogPosts.published, true)),
        });
        if (post) {
            await db
                .update(blogPosts)
                .set({ viewCount: post.viewCount + 1 })
                .where(eq(blogPosts.id, post.id));
        }
        return post;
    }),
    create: adminQuery
        .input(z.object({
        title: z.string().min(1),
        slug: z.string(),
        excerpt: z.string().optional(),
        content: z.string(),
        coverImage: z.string().optional(),
        category: z.string().optional(),
        tags: z.string().optional(),
        author: z.string().optional(),
        published: z.boolean().default(false),
        featured: z.boolean().default(false),
    }))
        .mutation(async ({ input }) => {
        const db = getDb();
        const result = await db.insert(blogPosts).values({
            title: input.title,
            slug: input.slug,
            excerpt: input.excerpt || null,
            content: input.content,
            coverImage: input.coverImage || null,
            category: input.category || null,
            tags: input.tags || null,
            author: input.author || null,
            published: input.published,
            featured: input.featured,
        });
        return { id: Number(result[0]?.insertId), success: true };
    }),
    update: adminQuery
        .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        coverImage: z.string().optional(),
        category: z.string().optional(),
        tags: z.string().optional(),
        author: z.string().optional(),
        published: z.boolean().optional(),
        featured: z.boolean().optional(),
    }))
        .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const db = getDb();
        await db
            .update(blogPosts)
            .set(data)
            .where(eq(blogPosts.id, id));
        return { success: true };
    }),
    delete: adminQuery
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
        const db = getDb();
        await db.delete(blogPosts).where(eq(blogPosts.id, input.id));
        return { success: true };
    }),
});
