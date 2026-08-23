import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import { getDb } from "./queries/connection.js";
import { localUsers } from "../db/schema.js";
import { eq } from "drizzle-orm";
import type { LocalUser } from "../db/schema.js";

export const LOCAL_AUTH_COOKIE = "rc_local_auth";
const TOKEN_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

function getJwtSecret(): string {
  const secret = process.env.LOCAL_AUTH_SECRET || process.env.APP_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("Missing LOCAL_AUTH_SECRET or APP_SECRET for local authentication.");
  }
  return secret || "rupali-construction-secret-key";
}

export function signLocalToken(userId: number): string {
  return jwt.sign({ userId, type: "local" }, getJwtSecret(), { expiresIn: "30d" });
}

export function serializeLocalAuthCookie(token: string, maxAge = TOKEN_MAX_AGE_SECONDS): string {
  return cookie.serialize(LOCAL_AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export async function verifyLocalToken(token: string): Promise<LocalUser | null> {
  try {
    const payload = jwt.verify(token, getJwtSecret(), { clockTolerance: 60 }) as {
      userId: number;
      type: string;
    };
    if (payload.type !== "local") return null;

    const db = getDb();
    const user = await db.query.localUsers.findFirst({
      where: eq(localUsers.id, payload.userId),
    });
    return user || null;
  } catch {
    return null;
  }
}
