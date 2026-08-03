import { TRPCError } from "@trpc/server";

type RateLimitRule = {
  limit: number;
  windowMs: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const entries = new Map<string, RateLimitEntry>();

/** Lightweight per-instance guard; configure matching limits at the deployment edge too. */
export function enforceRateLimit(request: Request, operation: string, rule: RateLimitRule) {
  const forwardedFor = request.headers.get("x-vercel-forwarded-for")
    ?? request.headers.get("cf-connecting-ip")
    ?? request.headers.get("x-forwarded-for");
  const clientId = forwardedFor?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
  const key = `${operation}:${clientId}`;
  const now = Date.now();

  if (entries.size > 10_000) {
    for (const [entryKey, entry] of entries) {
      if (entry.resetAt <= now) entries.delete(entryKey);
    }
  }

  const current = entries.get(key);
  if (!current || current.resetAt <= now) {
    entries.set(key, { count: 1, resetAt: now + rule.windowMs });
    return;
  }
  current.count += 1;
  if (current.count > rule.limit) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests. Please wait a few minutes and try again.",
    });
  }
}

export const mutationRateLimitRules: Record<string, RateLimitRule> = {
  "localAuth.login": { limit: 10, windowMs: 15 * 60 * 1000 },
  "localAuth.register": { limit: 5, windowMs: 60 * 60 * 1000 },
  "contact.submit": { limit: 5, windowMs: 60 * 60 * 1000 },
  "blog.submit": { limit: 3, windowMs: 60 * 60 * 1000 },
  "chat.send": { limit: 30, windowMs: 60 * 60 * 1000 },
  "chat.submitLead": { limit: 5, windowMs: 60 * 60 * 1000 },
  "chat.submitCostRequest": { limit: 5, windowMs: 60 * 60 * 1000 },
};
