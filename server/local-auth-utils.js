import jwt from "jsonwebtoken";
import { getDb } from "./queries/connection";
import { localUsers } from "@db/schema";
import { eq } from "drizzle-orm";
function getJwtSecret() {
    const secret = process.env.LOCAL_AUTH_SECRET || process.env.APP_SECRET;
    if (!secret && process.env.NODE_ENV === "production") {
        throw new Error("Missing LOCAL_AUTH_SECRET or APP_SECRET for local authentication.");
    }
    return secret || "rupali-construction-secret-key";
}
export function signLocalToken(userId) {
    return jwt.sign({ userId, type: "local" }, getJwtSecret(), { expiresIn: "30d" });
}
export async function verifyLocalToken(token) {
    try {
        const payload = jwt.verify(token, getJwtSecret(), { clockTolerance: 60 });
        if (payload.type !== "local")
            return null;
        const db = getDb();
        const user = await db.query.localUsers.findFirst({
            where: eq(localUsers.id, payload.userId),
        });
        return user || null;
    }
    catch {
        return null;
    }
}
