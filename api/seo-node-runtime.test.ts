import { it, expect } from "vitest";
import ts from "typescript";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

it("loads shared search HTML in Node ESM without a bundler resolving its imports", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "rupali-seo-runtime-"));
  try {
    await writeFile(path.join(directory, "package.json"), '{"type":"module"}');
    for (const name of ["local-seo", "construction-concerns", "home-html"]) {
      const source = await readFile(path.resolve("shared", `${name}.ts`), "utf8");
      const compiled = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
      });
      await writeFile(path.join(directory, `${name}.js`), compiled.outputText);
    }
    const entry = pathToFileURL(path.join(directory, "home-html.js")).href;
    const { stdout } = await promisify(execFile)(process.execPath, ["--input-type=module", "-e",
      `const {homeHtml} = await import(${JSON.stringify(entry)}); console.log(homeHtml());`,
    ]);
    expect(stdout).toContain("Your home. Thoughtfully built.");
    expect(stdout).toContain("11701277791317730988");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
