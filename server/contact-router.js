import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { contacts } from "@db/schema";
import { eq, desc } from "drizzle-orm";
export const contactRouter = createRouter({
    submit: publicQuery
        .input(z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Valid email is required"),
        phone: z.string().optional(),
        city: z.string().optional(),
        service: z.string().optional(),
        budget: z.string().optional(),
        message: z.string().optional(),
    }))
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
        .input(z.object({
        id: z.number(),
        status: z.enum(["new", "read", "replied", "archived"]),
    }))
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
        const all = await db.select().from(contacts);
        const total = all.length;
        const newCount = all.filter((c) => c.status === "new").length;
        const readCount = all.filter((c) => c.status === "read").length;
        const repliedCount = all.filter((c) => c.status === "replied").length;
        const archivedCount = all.filter((c) => c.status === "archived").length;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayCount = all.filter((c) => c.createdAt >= today).length;
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekCount = all.filter((c) => c.createdAt >= weekAgo).length;
        return { total, new: newCount, read: readCount, replied: repliedCount, archived: archivedCount, today: todayCount, thisWeek: weekCount };
    }),
});
