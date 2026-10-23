// Run with: node --import tsx scripts/prepare-supabase-recovery.mjs
// Only reconstructs public website content; never generates accounts or private records.
import fs from 'node:fs';
import { fallbackProjects } from '../shared/project-content.ts';
import { fallbackPosts } from '../shared/blog-content.ts';
const quote = value => value == null ? 'NULL' : typeof value === 'boolean' ? String(value) : "'" + String(value).replaceAll("'", "''") + "'";
const gymImages = JSON.parse(fallbackProjects.find(project => project.slug === 'gold-gym').images);
let schema = fs.readFileSync('db/migrations/0000_sturdy_sandman.sql', 'utf8')
 .replace(/CREATE TYPE ([^;]+);/g, (_, definition) => `DO $$ BEGIN CREATE TYPE ${definition}; EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
 .replaceAll('CREATE TABLE ', 'CREATE TABLE IF NOT EXISTS ')
 .replaceAll('--> statement-breakpoint', '');
for (const file of ['0001_production_hardening.sql','0002_project_reviews_and_instagram.sql']) schema += '\n' + fs.readFileSync('db/migrations/' + file, 'utf8').replaceAll('--> statement-breakpoint','');
const tables = [...schema.matchAll(/CREATE TABLE IF NOT EXISTS "([^"]+)"/g)].map(match => match[1]);
let sql = 'BEGIN;\n' + schema + '\n' + tables.map(table => `ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`).join('\n');
for (const project of fallbackProjects) {
 const values = { name: project.name, slug: project.slug, description: project.description, location: project.location, area: project.area, completionDate: project.completionDate, type: project.type, status:'completed', featured:true, images: JSON.stringify(project.slug === 'gold-gym' ? gymImages : []) };
 sql += `\nINSERT INTO projects (${Object.keys(values).map(k=>'"'+k+'"').join(',')}) VALUES (${Object.values(values).map(quote).join(',')}) ON CONFLICT (slug) DO NOTHING;`;
}
for (const post of fallbackPosts) {
 const values = { title:post.title, slug:post.slug, excerpt:post.excerpt, content:post.content, coverImage:post.coverImage, category:post.category, author:post.author, published:post.published, createdAt:post.createdAt.toISOString() };
 sql += `\nINSERT INTO blog_posts (${Object.keys(values).map(k=>'"'+k+'"').join(',')}) VALUES (${Object.values(values).map(quote).join(',')}) ON CONFLICT (slug) DO NOTHING;`;
}
sql += "\nINSERT INTO storage.buckets (id,name,public,file_size_limit,allowed_mime_types) VALUES ('images','images',true,10485760,ARRAY['image/jpeg','image/png','image/webp','image/gif','image/avif']) ON CONFLICT (id) DO NOTHING;\nCOMMIT;\nSELECT (SELECT count(*) FROM projects) AS projects, (SELECT count(*) FROM blog_posts) AS blog_posts, (SELECT count(*) FROM local_users) AS local_users;\n";
fs.mkdirSync('recovery',{recursive:true});
fs.writeFileSync('recovery/new-supabase.sql',sql);
if (!fs.existsSync('recovery/original-project-media.json')) fs.writeFileSync('recovery/original-project-media.json',JSON.stringify(fallbackProjects.map(({slug,images})=>({slug,originalImages:JSON.parse(images)})),null,2)+'\n');
console.log(`Prepared ${tables.length} tables, ${fallbackProjects.length} projects, ${fallbackPosts.length} articles, ${gymImages.length} verified gym images. No accounts or private records included.`);
