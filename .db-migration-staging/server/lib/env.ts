import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const e = process.env;

export const env = {
  appId: e.APP_ID || e.VITE_APP_ID || "",
  appSecret: e.APP_SECRET || "",
  isProduction: e.NODE_ENV === "production",
  databaseUrl: e.DATABASE_URL || "sqlite:memory",
  kimiAuthUrl: e.KIMI_AUTH_URL || e.VITE_KIMI_AUTH_URL || "https://auth.kimi.com",
  kimiOpenUrl: e.KIMI_OPEN_URL || "https://open.kimi.com",
  ownerUnionId: e.OWNER_UNION_ID ?? "",
  googleClientId: e.GOOGLE_CLIENT_ID || e.VITE_GOOGLE_CLIENT_ID || "",
  googleClientSecret: e.GOOGLE_CLIENT_SECRET || e.VITE_GOOGLE_CLIENT_SECRET || "",
};

export function requireKimiEnv() {
  if (!env.appId || !env.appSecret) {
    throw new Error("Kimi OAuth is not configured. Set APP_ID and APP_SECRET.");
  }
}
