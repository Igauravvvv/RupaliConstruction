import { getDb } from "./api/queries/connection";
import { localUsers } from "./db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signLocalToken } from "./api/local-auth-utils";

async function testLogin() {
  try {
    const db = getDb();
    console.log("DB connected");

    const username = "admin";
    const password = "admin123";

    console.log("Finding user...");
    const user = await db.query.localUsers.findFirst({
      where: eq(localUsers.username, username),
    });

    if (!user) {
      console.log("User not found");
      process.exit(1);
    }

    console.log("User found, checking password...");
    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      console.log("Invalid password");
      process.exit(1);
    }

    console.log("Password valid, signing token...");
    const token = signLocalToken(user.id);

    console.log("Login successful! Token:", token);
    process.exit(0);
  } catch (error) {
    console.error("Login test failed with error:");
    console.error(error);
    process.exit(1);
  }
}

testLogin();
