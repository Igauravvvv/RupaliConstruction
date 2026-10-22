import { readdir, readFile } from "node:fs/promises";

const origin = "https://rupaliconstruction.com";
const publicDir = new URL("../public/", import.meta.url);
const keyFile = (await readdir(publicDir)).find(name => /^[a-f0-9]{32}\.txt$/.test(name));
if (!keyFile) throw new Error("IndexNow verification file is missing.");
const key = (await readFile(new URL(keyFile, publicDir), "utf8")).trim();
const verification = await fetch(`${origin}/${keyFile}`);
if (!verification.ok || (await verification.text()).trim() !== key) {
  throw new Error("Deploy the IndexNow verification file before submitting URLs.");
}
const paths = process.argv.slice(2);
const urlList = [...new Set((paths.length ? paths : [
  "/", "/building-guide-gurgaon", "/sitemap", "/services", "/projects", "/blog", "/contact",
]).map(path => new URL(path, origin).href))];
for (const url of urlList) {
  if (new URL(url).origin !== origin) throw new Error("Submit only Rupali Construction URLs.");
  const response = await fetch(url, { redirect: "manual" });
  if (response.status !== 200) throw new Error(`URL is not a published page: ${url} (${response.status})`);
}
const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ host: new URL(origin).hostname, key, keyLocation: `${origin}/${keyFile}`, urlList }),
});
if (![200, 202].includes(response.status)) {
  throw new Error(`IndexNow rejected submission (${response.status}): ${(await response.text()).slice(0, 500)}`);
}
console.log(`IndexNow received ${urlList.length} URLs (HTTP ${response.status}). This is a crawl notification, not confirmation of indexing or ranking.`);
