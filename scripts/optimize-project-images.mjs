// Refresh public image variants after changing project galleries. No credentials required.
// node scripts/optimize-project-images.mjs [optional project-list JSON file]
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const root = process.cwd();
const projects = process.argv[2]
  ? JSON.parse(await fs.readFile(process.argv[2], 'utf8'))
  : (await (await fetch('https://rupaliconstruction.com/api/trpc/project.list?input=%7B%22json%22%3A%7B%22limit%22%3A50%7D%7D')).json()).result.data.json.items;
const sources = [...new Set(projects.flatMap(project => JSON.parse(project.images || '[]')))];
const serviceFiles = (await fs.readdir('public/images/services')).filter(name => name.endsWith('.webp'));
sources.push(...serviceFiles.map(name => `/images/services/${name}`));
const output = 'public/images/responsive';
await fs.mkdir(output, { recursive: true });
const manifest = {};
let originals = 0, small = 0, large = 0;
for (const src of sources) {
  const data = src.startsWith('/') ? await fs.readFile(`public${src}`) : await (async () => {
    const response = await fetch(src);
    if (!response.ok) throw new Error(`${src}: ${response.status}`);
    return Buffer.from(await response.arrayBuffer());
  })();
  const metadata = await sharp(data).metadata();
  const hash = createHash('sha256').update(data).digest('hex').slice(0, 12);
  const stem = path.basename(src, path.extname(src));
  const variants = [];
  for (const width of [480, 1280]) {
    const actualWidth = Math.min(width, metadata.width);
    if (variants.some(item => item.width === actualWidth)) continue;
    const file = `${stem}-${hash}-${actualWidth}.webp`;
    const result = await sharp(data).rotate().resize({ width: actualWidth, withoutEnlargement: true }).webp({ quality: 80, effort: 5 }).toBuffer();
    await fs.writeFile(`${output}/${file}`, result);
    variants.push({ src: `/images/responsive/${file}`, width: actualWidth, bytes: result.length });
  }
  manifest[src] = { width: metadata.width, height: metadata.height, bytes: data.length, variants };
  originals += data.length; small += variants[0].bytes; large += variants.at(-1).bytes;
}
await fs.writeFile(path.join(root, 'src/lib/responsive-image-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ images: sources.length, originals, small, large, smallReduction: `${Math.round((1-small/originals)*100)}%`, largeReduction: `${Math.round((1-large/originals)*100)}%` }));
