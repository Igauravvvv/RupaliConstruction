import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { users, localUsers, contacts, blogPosts, projects, testimonials } from "@db/schema";
import { sql } from "drizzle-orm";

export const adminRouter = createRouter({
  dashboardStats: adminQuery.query(async () => {
    const db = getDb();

    const oauthCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);
    const localCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(localUsers);
    const contactCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(contacts);
    const blogCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(blogPosts);
    const projectCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(projects);
    const testimonialCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(testimonials);

    return {
      users: {
        oauth: oauthCount[0]?.count || 0,
        local: localCount[0]?.count || 0,
        total: (oauthCount[0]?.count || 0) + (localCount[0]?.count || 0),
      },
      contacts: contactCount[0]?.count || 0,
      blogPosts: blogCount[0]?.count || 0,
      projects: projectCount[0]?.count || 0,
      testimonials: testimonialCount[0]?.count || 0,
    };
  }),

  userList: adminQuery.query(async () => {
    const db = getDb();
    const oauthUsers = await db.select().from(users);
    const localUsersList = await db.select().from(localUsers);

    return {
      oauth: oauthUsers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        authType: "oauth" as const,
        createdAt: u.createdAt,
      })),
      local: localUsersList.map((u) => ({
        id: u.id,
        name: u.displayName || u.username,
        email: u.email,
        role: u.role,
        authType: "local" as const,
        createdAt: u.createdAt,
      })),
    };
  }),
});
