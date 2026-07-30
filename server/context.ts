import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User, LocalUser } from "../db/schema.js";
import { authenticateRequest } from "./kimi/auth.js";
import { verifyLocalToken } from "./local-auth-utils.js";

export type UnifiedUser = {
  id: number;
  name: string;
  email: string | null;
  avatar?: string | null;
  role: "user" | "admin";
  authType: "oauth" | "local";
  uniqueId?: string;
  phoneNumber?: string | null;
};

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: UnifiedUser;
};

function oauthToUnified(u: User): UnifiedUser {
  return {
    id: u.id,
    name: u.name || "User",
    email: u.email,
    avatar: u.avatar,
    role: u.role as "user" | "admin",
    authType: "oauth",
    phoneNumber: u.phoneNumber,
  };
}

function localToUnified(u: LocalUser): UnifiedUser {
  return {
    id: u.id + 100000,
    name: u.displayName || u.username,
    email: u.email,
    avatar: u.avatar || null,
    role: u.role as "user" | "admin",
    authType: "local",
    uniqueId: u.uniqueId,
    phoneNumber: u.phoneNumber,
  };
}

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };

  // Try OAuth first
  try {
    const oauthUser = await authenticateRequest(opts.req.headers);
    if (oauthUser) {
      ctx.user = oauthToUnified(oauthUser);
      return ctx;
    }
  } catch {
    // OAuth not available
  }

  // Fall back to local auth
  try {
    let token = opts.req.headers.get("x-local-auth-token");
    if (!token) {
      const authHeader = opts.req.headers.get("authorization");
      if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
        token = authHeader.substring(7);
      }
    }
    
    if (token) {
      const localUser = await verifyLocalToken(token);
      if (localUser) {
        ctx.user = localToUnified(localUser);
      }
    }
  } catch {
    // Local auth not available
  }

  return ctx;
}
