import "dotenv/config";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import postgres from "postgres";

const accountsJson = process.env.ADMIN_ACCOUNTS;
const resetPasswords = process.argv.includes("--reset-passwords");

if (!accountsJson) {
  console.error(
    "ADMIN_ACCOUNTS is required. Provide a JSON array of { username, password, displayName?, email? }.",
  );
  process.exit(1);
}

let accounts;
try {
  accounts = JSON.parse(accountsJson);
} catch {
  console.error("ADMIN_ACCOUNTS must be valid JSON.");
  process.exit(1);
}

if (!Array.isArray(accounts) || accounts.length === 0) {
  console.error("ADMIN_ACCOUNTS must contain at least one account.");
  process.exit(1);
}

for (const account of accounts) {
  if (!account || !/^[A-Za-z0-9._-]{3,50}$/.test(account.username || "")) {
    throw new Error("Each admin username must be 3-50 characters using letters, numbers, '.', '_' or '-'.");
  }
  if (typeof account.password !== "string" || account.password.length < 4) {
    throw new Error(`Password for ${account.username} must contain at least 4 characters.`);
  }
  if (account.email && !/^\S+@\S+\.\S+$/.test(account.email)) {
    throw new Error(`Email for ${account.username} is invalid.`);
  }
}

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", connect_timeout: 10 });

async function createUniqueId() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const uniqueId = `RC-${randomBytes(4).toString("hex").toUpperCase()}`;
    const [existing] = await sql`select 1 from local_users where "uniqueId" = ${uniqueId}`;
    if (!existing) return uniqueId;
  }
  throw new Error("Could not generate a unique Rupali Construction ID.");
}

try {
  for (const account of accounts) {
    const [existing] = await sql`
      select id, "passwordHash" from local_users where username = ${account.username}
    `;

    if (existing) {
      if (resetPasswords) {
        const passwordHash = await bcrypt.hash(account.password, 12);
        await sql`
          update local_users
          set role = 'admin', "passwordHash" = ${passwordHash},
              "displayName" = ${account.displayName || account.username},
              email = ${account.email || null}, "updatedAt" = now()
          where id = ${existing.id}
        `;
        console.log(`Updated administrator: ${account.username}`);
      } else {
        await sql`update local_users set role = 'admin', "updatedAt" = now() where id = ${existing.id}`;
        console.log(`Granted administrator access to existing account: ${account.username}`);
      }
      continue;
    }

    const passwordHash = await bcrypt.hash(account.password, 12);
    await sql`
      insert into local_users (
        "uniqueId", username, "displayName", email, "passwordHash", "authProvider", role,
        "profileCompleted", "createdAt", "updatedAt", "lastSignInAt"
      ) values (
        ${await createUniqueId()}, ${account.username}, ${account.displayName || account.username},
        ${account.email || null}, ${passwordHash}, 'local', 'admin', true, now(), now(), now()
      )
    `;
    console.log(`Created administrator: ${account.username}`);
  }
} finally {
  await sql.end();
}
