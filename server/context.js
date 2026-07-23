import { authenticateRequest } from "./kimi/auth";
import { verifyLocalToken } from "./local-auth-utils";
function oauthToUnified(u) {
    return {
        id: u.id,
        name: u.name || "User",
        email: u.email,
        avatar: u.avatar,
        role: u.role,
        authType: "oauth",
    };
}
function localToUnified(u) {
    return {
        id: u.id + 100000,
        name: u.displayName || u.username,
        email: u.email,
        avatar: null,
        role: u.role,
        authType: "local",
    };
}
export async function createContext(opts) {
    const ctx = { req: opts.req, resHeaders: opts.resHeaders };
    // Try OAuth first
    try {
        const oauthUser = await authenticateRequest(opts.req.headers);
        if (oauthUser) {
            ctx.user = oauthToUnified(oauthUser);
            return ctx;
        }
    }
    catch {
        // OAuth not available
    }
    // Fall back to local auth
    try {
        const token = opts.req.headers.get("x-local-auth-token");
        if (token) {
            const localUser = await verifyLocalToken(token);
            if (localUser) {
                ctx.user = localToUnified(localUser);
            }
        }
    }
    catch {
        // Local auth not available
    }
    return ctx;
}
