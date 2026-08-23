const postgres = require("postgres");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const sql = postgres(connectionString, { prepare: false });

async function run() {
  console.log("Applying missing schema columns...");

  try {
    await sql`ALTER TABLE "local_users" ADD COLUMN "phoneNumber" varchar(50);`;
    console.log("✅ Added phoneNumber to local_users");
  } catch (err) {
    console.log("⚠️ local_users.phoneNumber: " + err.message);
  }

  try {
    await sql`ALTER TABLE "users" ADD COLUMN "phoneNumber" varchar(50);`;
    console.log("✅ Added phoneNumber to users");
  } catch (err) {
    console.log("⚠️ users.phoneNumber: " + err.message);
  }

  try {
    await sql`ALTER TABLE "local_users" ADD COLUMN "googleId" varchar(255) UNIQUE;`;
    console.log("✅ Added googleId to local_users");
  } catch (err) {
    console.log("⚠️ local_users.googleId: " + err.message);
  }
  
  try {
    await sql`ALTER TABLE "local_users" ADD COLUMN "authProvider" auth_provider DEFAULT 'local' NOT NULL;`;
    console.log("✅ Added authProvider to local_users");
  } catch (err) {
    console.log("⚠️ local_users.authProvider: " + err.message);
  }

  console.log("Done.");
  process.exit(0);
}

run().catch(console.error);
