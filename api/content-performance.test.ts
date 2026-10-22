import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { drizzle } from "drizzle-orm/postgres-js";
import { projects } from "../db/schema";
import { publicProjectFields } from "../server/queries/project-fields";
import { cachedPublicContent, clearPublicContentCache, publicResponseMeta } from "../server/public-content-cache";

describe("public content performance and privacy", () => {
  beforeEach(() => { clearPublicContentCache(); vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); clearPublicContentCache(); });

  it("coalesces concurrent loads, reuses fresh data and reloads after expiry", async () => {
    const load = vi.fn(async () => ({ items: ["project"] }));
    await Promise.all([cachedPublicContent("projects", load), cachedPublicContent("projects", load)]);
    await cachedPublicContent("projects", load);
    expect(load).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(30_001);
    await cachedPublicContent("projects", load);
    expect(load).toHaveBeenCalledTimes(2);
  });

  it("does not keep failed queries in the cache", async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error("temporary")).mockResolvedValueOnce([]);
    await expect(cachedPublicContent("projects", load)).rejects.toThrow("temporary");
    await expect(cachedPublicContent("projects", load)).resolves.toEqual([]);
    expect(load).toHaveBeenCalledTimes(2);
  });

  it("never marks authenticated, mixed, failed or mutation responses as shared cacheable", () => {
    expect(publicResponseMeta(["project.list"], [], "query").headers["Cache-Control"]).toContain("s-maxage=60");
    for (const paths of [["auth.me"], ["project.list", "localAuth.me"], ["project.create"]]) {
      expect(publicResponseMeta(paths, [], "query").headers["Cache-Control"]).toBe("private, no-store");
    }
    expect(publicResponseMeta(["project.list"], [new Error()], "query").headers["Cache-Control"]).toBe("private, no-store");
    expect(publicResponseMeta(["project.list"], [], "mutation").headers["Cache-Control"]).toBe("private, no-store");
  });

  it("does not select cost or require optional columns on older project tables", () => {
    const query = drizzle.mock().select(publicProjectFields).from(projects).toSQL().sql;
    expect(query).toContain('to_jsonb("projects")->>\'process_steps\'');
    expect(query).not.toContain('"projects"."process_steps"');
    expect(query).not.toContain('"projects"."reviewerName"');
    expect(query).not.toContain('"cost"');
  });
});
