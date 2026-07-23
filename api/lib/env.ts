import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

function required(name: string): string {
  const e = process.env;
  const value = e[name];
  if (!value && e.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

const e = process.env;

export const env = {
  appId: required("APP_ID"),
  appSecret: required("APP_SECRET"),
  isProduction: e.NODE_ENV === "production",
  databaseUrl: e.DATABASE_URL || "sqlite:memory",
  kimiAuthUrl: e.KIMI_AUTH_URL || e.VITE_KIMI_AUTH_URL || "https://auth.kimi.com",
  kimiOpenUrl: e.KIMI_OPEN_URL || "https://open.kimi.com",
  ownerUnionId: e.OWNER_UNION_ID ?? "",
  googleClientId: e.GOOGLE_CLIENT_ID || e.VITE_GOOGLE_CLIENT_ID || "",
  googleClientSecret: e.GOOGLE_CLIENT_SECRET || e.VITE_GOOGLE_CLIENT_SECRET || "",
};
