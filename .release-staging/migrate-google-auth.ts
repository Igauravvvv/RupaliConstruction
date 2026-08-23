import postgres from "postgres";
import "dotenv/config";

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

async function migrate() {
  console.log("Running Google auth migration...");

  try {
    // 1. Create auth_provider enum if not exists
    await sql`
      DO $$ BEGIN
        CREATE TYPE auth_provider AS ENUM ('local', 'google');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    console.log("✅ auth_provider enum created");

    // 2. Add uniqueId column (nullable first, then backfill, then make NOT NULL)
    try {
      await sql`ALTER TABLE local_users ADD COLUMN "uniqueId" VARCHAR(20)`;
      console.log("✅ uniqueId column added");
    } catch (e: any) {
      if (e.message?.includes("already exists")) {
        console.log("⏭️  uniqueId column already exists");
      } else throw e;
    }

    // 3. Add googleId column
    try {
      await sql`ALTER TABLE local_users ADD COLUMN "googleId" VARCHAR(255) UNIQUE`;
      console.log("✅ googleId column added");
    } catch (e: any) {
      if (e.message?.includes("already exists")) {
        console.log("⏭️  googleId column already exists");
      } else throw e;
    }

    // 4. Add avatar column
    try {
      await sql`ALTER TABLE local_users ADD COLUMN "avatar" TEXT`;
      console.log("✅ avatar column added");
    } catch (e: any) {
      if (e.message?.includes("already exists")) {
        console.log("⏭️  avatar column already exists");
      } else throw e;
    }

    // 5. Add authProvider column
    try {
      await sql`ALTER TABLE local_users ADD COLUMN "authProvider" auth_provider DEFAULT 'local' NOT NULL`;
      console.log("✅ authProvider column added");
    } catch (e: any) {
      if (e.message?.includes("already exists")) {
        console.log("⏭️  authProvider column already exists");
      } else throw e;
    }

    // 6. Make passwordHash nullable
    try {
      await sql`ALTER TABLE local_users ALTER COLUMN "passwordHash" DROP NOT NULL`;
      console.log("✅ passwordHash made nullable");
    } catch (e: any) {
      console.log("⏭️  passwordHash already nullable or error:", e.message);
    }

    // 7. Backfill existing rows with uniqueId
    const rows = await sql`SELECT id FROM local_users WHERE "uniqueId" IS NULL`;
    for (const row of rows) {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let uid = "RC-";
      for (let i = 0; i < 8; i++) {
        uid += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      await sql`UPDATE local_users SET "uniqueId" = ${uid} WHERE id = ${row.id}`;
      console.log(`  ↳ Updated user ${row.id} with uniqueId: ${uid}`);
    }

    // 8. Now make uniqueId NOT NULL and UNIQUE
    try {
      await sql`ALTER TABLE local_users ALTER COLUMN "uniqueId" SET NOT NULL`;
      console.log("✅ uniqueId set to NOT NULL");
    } catch (e: any) {
      console.log("⏭️  uniqueId NOT NULL error:", e.message);
    }

    try {
      await sql`ALTER TABLE local_users ADD CONSTRAINT "local_users_uniqueId_unique" UNIQUE ("uniqueId")`;
      console.log("✅ uniqueId unique constraint added");
    } catch (e: any) {
      if (e.message?.includes("already exists")) {
        console.log("⏭️  uniqueId unique constraint already exists");
      } else throw e;
    }

    console.log("\n🎉 Migration complete!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await sql.end();
  }
}

migrate();
