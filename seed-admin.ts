import { getDb } from "./api/queries/connection";
import { localUsers } from "./db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  try {
    const db = getDb();
    console.log("Checking for admin user...");

    const existing = await db.query.localUsers.findFirst({
      where: eq(localUsers.username, "admin"),
    });

    if (!existing) {
      const passwordHash = await bcrypt.hash("admin123", 12);
      await db.insert(localUsers).values({
        uniqueId: "RC-ADMIN001",
        username: "admin",
        passwordHash,
        displayName: "Administrator",
        authProvider: "local",
        role: "admin",
      });
      console.log("Admin user created successfully!");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Could not seed admin user. Make sure the database is migrated.", error);
  }
}

seedAdmin();
