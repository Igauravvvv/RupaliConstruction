import { ErrorMessages } from "../contracts/constants.js";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context.js";
import { enforceRateLimit, mutationRateLimitRules } from "./rate-limit.js";

function normalizeOrigin(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    return new URL(value.includes("://") ? value : `https://${value}`).origin;
  } catch {
    return null;
  }
}

function getAllowedRequestOrigins(req: Request): Set<string> {
  const origins = new Set<string>();
  const requestOrigin = normalizeOrigin(req.url);
  if (requestOrigin) origins.add(requestOrigin);

  // Vercel can expose its internal deployment URL as Request.url while the
  // browser is correctly using the custom domain. Accept the proxy-provided
  // public origin as well as the configured canonical origins.
  const forwardedHost = req.headers.get("x-forwarded-host");
  if (forwardedHost) {
    const forwardedProto = req.headers.get("x-forwarded-proto") || "https";
    const forwardedOrigin = normalizeOrigin(`${forwardedProto}://${forwardedHost}`);
    if (forwardedOrigin) origins.add(forwardedOrigin);
  }

  for (const value of [
    process.env.PUBLIC_SITE_URL,
    process.env.SITE_URL,
    process.env.APP_URL,
  ]) {
    const configuredOrigin = normalizeOrigin(value);
    if (configuredOrigin) origins.add(configuredOrigin);
  }

  return origins;
}

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    // Keep SQL, parameters and credentials out of public error responses while
    // retaining a safe database/network code for diagnosing production outages.
    let cause: unknown = error.cause;
    let serviceErrorCode: string | undefined;
    for (let depth = 0; cause && typeof cause === "object" && depth < 5; depth++) {
      const detail = cause as { code?: unknown; cause?: unknown };
      if (typeof detail.code === "string" && /^[A-Z0-9_]{2,32}$/.test(detail.code)) serviceErrorCode = detail.code;
      cause = detail.cause;
    }
    return { ...shape,
      message: error.code === "INTERNAL_SERVER_ERROR" ? "This service is temporarily unavailable." : shape.message,
      data: { ...shape.data, serviceErrorCode },
    };
  },
});

const errorLogger = t.middleware(async (opts) => {
  try {
    return await opts.next();
  } catch (err) {
    console.error("TRPC Error in", opts.path, ":", err);
    throw err;
  }
});

const mutationSecurity = t.middleware(async (opts) => {
  if (opts.type !== "mutation") return opts.next();

  const origin = opts.ctx.req.headers.get("origin");
  if (origin && !getAllowedRequestOrigins(opts.ctx.req).has(origin)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Cross-origin requests are not allowed." });
  }

  const rule = mutationRateLimitRules[opts.path];
  if (rule) enforceRateLimit(opts.ctx.req, opts.path, rule);
  return opts.next();
});

export const createRouter = t.router;
export const publicQuery = t.procedure.use(errorLogger).use(mutationSecurity);

const requireAuth = t.middleware(async (opts) => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: ErrorMessages.unauthenticated,
    });
  }

  return next({ ctx: { ...ctx, user: ctx.user } });
});

function requireRole(role: string) {
  return t.middleware(async (opts) => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== role) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: ErrorMessages.insufficientRole,
      });
    }

    return next({ ctx: { ...ctx, user: ctx.user } });
  });
}

export const authedQuery = t.procedure.use(requireAuth);
export const adminQuery = authedQuery.use(requireRole("admin"));
