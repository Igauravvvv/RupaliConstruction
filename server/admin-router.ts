import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { users, localUsers, contacts, blogPosts, projects, testimonials, constructionLeads, costCalculatorRequests } from "@db/schema";
import { sql, eq, desc } from "drizzle-orm";
import { z } from "zod";
import ExcelJS from "exceljs";

export const adminRouter = createRouter({
  dashboardStats: adminQuery.query(async () => {
    const db = getDb();

    const oauthCount = await db.select({ count: sql<number>`count(*)` }).from(users);
    const localCount = await db.select({ count: sql<number>`count(*)` }).from(localUsers);
    const contactCount = await db.select({ count: sql<number>`count(*)` }).from(contacts);
    const blogCount = await db.select({ count: sql<number>`count(*)` }).from(blogPosts);
    const projectCount = await db.select({ count: sql<number>`count(*)` }).from(projects);
    const testimonialCount = await db.select({ count: sql<number>`count(*)` }).from(testimonials);
    const leadsCount = await db.select({ count: sql<number>`count(*)` }).from(constructionLeads);
    const costReqCount = await db.select({ count: sql<number>`count(*)` }).from(costCalculatorRequests);

    // Get today's leads
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const allLeads = await db.select().from(constructionLeads);
    const todayLeads = allLeads.filter(l => l.createdAt >= today).length;
    
    // Get pending follow-ups
    const pendingLeads = allLeads.filter(l => l.status === "new" || l.status === "follow-up").length;

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
      chatbotLeads: leadsCount[0]?.count || 0,
      costRequests: costReqCount[0]?.count || 0,
      todayLeads,
      pendingLeads,
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
