import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../lib/env.js";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>> | null = null;

export function getDb() {
  if (!instance) {
    const connectionUrl = env.databaseUrl;
    if (!connectionUrl || connectionUrl === "sqlite:memory") {
      throw new Error("DATABASE_URL is not configured. Please set it in your .env file.");
    }
    console.log("[DB] Creating new database connection...");
    const client = postgres(connectionUrl, { prepare: false });
    instance = drizzle(client, {
      schema: fullSchema,
    });
  }
  return instance;
}

/** Reset the cached connection (useful when credentials change). */
export function resetDb() {
  instance = null;
}
