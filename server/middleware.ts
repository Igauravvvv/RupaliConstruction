import { ErrorMessages } from "../contracts/constants.js";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context.js";
import { enforceRateLimit, mutationRateLimitRules } from "./rate-limit.js";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
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
  if (origin && origin !== new URL(opts.ctx.req.url).origin) {
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
