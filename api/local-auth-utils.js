import jwt from "jsonwebtoken";
import { getDb } from "./queries/connection";
import { localUsers } from "@db/schema";
import { eq } from "drizzle-orm";
const JWT_SECRET = process.env.APP_SECRET || "rupali-construction-secret-key";
export function signLocalToken(userId) {
    return jwt.sign({ userId, type: "local" }, JWT_SECRET, { expiresIn: "30d" });
}
export async function verifyLocalToken(token) {
    try {
        const payload = jwt.verify(token, JWT_SECRET, { clockTolerance: 60 });
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
