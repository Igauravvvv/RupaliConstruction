const publicPaths = new Set(["project.list", "project.bySlug", "blog.list", "blog.bySlug"]);

export function isPublicContentPath(path: string) {
  return publicPaths.has(path);
}

export function publicResponseMeta(paths: readonly string[] | undefined, errors: unknown[], type?: string) {
  const cacheable = type === "query" && !errors.length && !!paths?.length && paths.every(isPublicContentPath);
  return { headers: { "Cache-Control": cacheable
    ? "public, max-age=30, s-maxage=60, stale-while-revalidate=300"
    : "private, no-store" } };
}

const entries = new Map<string, { expires: number; promise: Promise<unknown> }>();

export async function cachedPublicContent<T>(key: string, load: () => Promise<T>, ttl = 30_000): Promise<T> {
  const existing = entries.get(key);
  if (existing && existing.expires > Date.now()) return existing.promise as Promise<T>;
  const entry = { expires: Date.now() + ttl, promise: Promise.resolve().then(load) as Promise<unknown> };
  if (entries.size >= 100) entries.delete(entries.keys().next().value!);
  entries.set(key, entry);
  try { return await entry.promise as T; }
  catch (error) { if (entries.get(key) === entry) entries.delete(key); throw error; }
}

export function clearPublicContentCache() { entries.clear(); }
