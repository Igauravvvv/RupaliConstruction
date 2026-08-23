import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User, LocalUser } from "../db/schema.js";
import { authenticateRequest } from "./kimi/auth.js";
import { verifyLocalToken } from "./local-auth-utils.js";
import { LOCAL_AUTH_COOKIE } from "./local-auth-utils.js";
import * as cookie from "cookie";

export type UnifiedUser = {
  id: number;
  name: string;
  email: string | null;
  avatar?: string | null;
  role: "user" | "admin";
  authType: "oauth" | "local";
  uniqueId?: string;
  phoneNumber?: string | null;
  profileCompleted: boolean;
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
    profileCompleted: u.profileCompleted,
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
    profileCompleted: u.profileCompleted,
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
    const cookies = cookie.parse(opts.req.headers.get("cookie") || "");
    const token = cookies[LOCAL_AUTH_COOKIE];
    
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
