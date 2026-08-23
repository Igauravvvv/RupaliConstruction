import { createRouter, adminQuery } from "./middleware.js";
import { getDb } from "./queries/connection.js";
import { users, localUsers, contacts, blogPosts, projects, testimonials, constructionLeads, costCalculatorRequests } from "../db/schema.js";
import { sql, eq, desc } from "drizzle-orm";
import { z } from "zod";
import ExcelJS from "exceljs";

export const adminRouter = createRouter({
  dashboardStats: adminQuery.query(async () => {
    const db = getDb();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [oauthStats, localStats, contactCount, blogCount, projectCount, testimonialCount, leadStats, costReqCount] = await Promise.all([
      db.select({
        count: sql<number>`count(*)`,
        loginsToday: sql<number>`count(*) filter (where ${users.lastSignInAt} >= ${today})`,
      }).from(users),
      db.select({
        count: sql<number>`count(*)`,
        loginsToday: sql<number>`count(*) filter (where ${localUsers.lastSignInAt} >= ${today})`,
      }).from(localUsers),
      db.select({ count: sql<number>`count(*)` }).from(contacts),
      db.select({ count: sql<number>`count(*)` }).from(blogPosts),
      db.select({ count: sql<number>`count(*)` }).from(projects),
      db.select({ count: sql<number>`count(*)` }).from(testimonials),
      db.select({
        count: sql<number>`count(*)`,
        today: sql<number>`count(*) filter (where ${constructionLeads.createdAt} >= ${today})`,
        pending: sql<number>`count(*) filter (where ${constructionLeads.status} in ('new', 'follow-up'))`,
      }).from(constructionLeads),
      db.select({ count: sql<number>`count(*)` }).from(costCalculatorRequests),
    ]);

    const oauth = oauthStats[0];
    const local = localStats[0];
    const leads = leadStats[0];

    return {
      users: {
        oauth: Number(oauth?.count ?? 0),
        local: Number(local?.count ?? 0),
        total: Number(oauth?.count ?? 0) + Number(local?.count ?? 0),
        loginsToday: Number(oauth?.loginsToday ?? 0) + Number(local?.loginsToday ?? 0),
      },
      contacts: Number(contactCount[0]?.count ?? 0),
      blogPosts: Number(blogCount[0]?.count ?? 0),
      projects: Number(projectCount[0]?.count ?? 0),
      testimonials: Number(testimonialCount[0]?.count ?? 0),
      chatbotLeads: Number(leads?.count ?? 0),
      costRequests: Number(costReqCount[0]?.count ?? 0),
      todayLeads: Number(leads?.today ?? 0),
      pendingLeads: Number(leads?.pending ?? 0),
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
        phone: u.phoneNumber,
        role: u.role,
        authType: "oauth" as const,
        createdAt: u.createdAt,
        lastSignInAt: u.lastSignInAt,
        profileCompleted: u.profileCompleted,
      })),
      local: localUsersList.map((u) => ({
        id: u.id,
        name: u.displayName || u.username,
        email: u.email,
        phone: u.phoneNumber,
        role: u.role,
        authType: "local" as const,
        createdAt: u.createdAt,
        lastSignInAt: u.lastSignInAt,
        profileCompleted: u.profileCompleted,
      })),
    };
  }),

  leads: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(constructionLeads).orderBy(desc(constructionLeads.createdAt));
  }),

  updateLead: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "follow-up", "converted", "closed"]).optional(),
        assignedTo: z.string().nullable().optional(),
        remarks: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const updateData: any = {};
      if (input.status !== undefined) updateData.status = input.status;
      if (input.assignedTo !== undefined) updateData.assignedTo = input.assignedTo;
      if (input.remarks !== undefined) updateData.remarks = input.remarks;

      await db
        .update(constructionLeads)
        .set(updateData)
        .where(eq(constructionLeads.id, input.id));
      return { success: true };
    }),

  deleteLead: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(constructionLeads).where(eq(constructionLeads.id, input.id));
      return { success: true };
    }),

  costRequests: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(costCalculatorRequests).orderBy(desc(costCalculatorRequests.createdAt));
  }),

  exportUsersToExcel: adminQuery.mutation(async () => {
    const db = getDb();
    const oauthUsers = await db.select().from(users);
    const localUsersList = await db.select().from(localUsers);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Users");
    
    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Type", key: "type", width: 15 },
      { header: "Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 35 },
      { header: "Phone Number", key: "phone", width: 20 },
      { header: "Role", key: "role", width: 15 },
      { header: "Created At", key: "createdAt", width: 25 },
    ];

    oauthUsers.forEach(u => {
      sheet.addRow({
        id: u.id,
        type: "OAuth",
        name: u.name,
        email: u.email,
        phone: u.phoneNumber,
        role: u.role,
        createdAt: new Date(u.createdAt).toLocaleString(),
      });
    });

    localUsersList.forEach(u => {
      sheet.addRow({
        id: u.id,
        type: u.authProvider === "google" ? "Google OAuth" : "Local",
        name: u.displayName || u.username,
        email: u.email,
        phone: u.phoneNumber,
        role: u.role,
        createdAt: new Date(u.createdAt).toLocaleString(),
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return { data: Buffer.from(buffer).toString("base64") };
  }),

  exportLeadsToExcel: adminQuery.mutation(async () => {
    const db = getDb();
    const leads = await db.select().from(constructionLeads).orderBy(desc(constructionLeads.createdAt));

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Leads");
    
    sheet.columns = [
      { header: "Reference ID", key: "referenceId", width: 15 },
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 35 },
      { header: "Phone", key: "phone", width: 20 },
      { header: "Location", key: "location", width: 30 },
      { header: "Project Type", key: "projectType", width: 20 },
      { header: "Plot Size", key: "plotSize", width: 15 },
      { header: "Budget", key: "budget", width: 20 },
      { header: "Status", key: "status", width: 15 },
      { header: "Created At", key: "createdAt", width: 25 },
    ];

    leads.forEach(l => {
      sheet.addRow({
        referenceId: l.referenceId,
        name: l.name || "-",
        email: l.email || "-",
        phone: l.phone || "-",
        location: [l.city, l.state].filter(Boolean).join(", ") || "-",
        projectType: l.projectType || "-",
        plotSize: l.plotSize || "-",
        budget: l.budget || "-",
        status: l.status.toUpperCase(),
        createdAt: new Date(l.createdAt).toLocaleString(),
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return { data: Buffer.from(buffer).toString("base64") };
  }),
});
