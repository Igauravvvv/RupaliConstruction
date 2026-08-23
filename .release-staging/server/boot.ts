import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router.js";
import { createContext } from "./context.js";
import { env } from "./lib/env.js";
import { createOAuthCallbackHandler } from "./kimi/auth.js";
import { Paths } from "../contracts/constants.js";
import { googleAuth } from "./google-auth-router.js";
import { sitemapHandler } from "./sitemap.js";
import { seoPrerenderHandler } from "./seo-prerender.js";
import { authenticateRequest } from "./kimi/auth.js";
import { LOCAL_AUTH_COOKIE, verifyLocalToken } from "./local-auth-utils.js";
import * as cookie from "cookie";
import { randomUUID } from "node:crypto";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use("*", async (c, next) => {
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (env.isProduction) c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  await next();
});
app.use("/api/upload", bodyLimit({ maxSize: 10 * 1024 * 1024 }));
app.get(Paths.oauthCallback, createOAuthCallbackHandler());
app.route("", googleAuth);
import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const imageExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

// Ensure uploads directory exists for local development only.
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!env.isProduction && !fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Supabase Storage configuration (REST API — used for presigned uploads)
const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseBucket = process.env.SUPABASE_BUCKET_NAME || "images";
const supabaseConfigured = !!(supabaseUrl && supabaseServiceKey);

// Legacy S3 client (kept for backwards compatibility if someone already set S3 vars)
const s3Configured = !!(process.env.SUPABASE_S3_ACCESS_KEY_ID && process.env.SUPABASE_S3_SECRET_ACCESS_KEY && process.env.SUPABASE_S3_ENDPOINT);
const s3Client = s3Configured ? new S3Client({
  region: process.env.SUPABASE_S3_REGION || "ap-south-1",
  endpoint: process.env.SUPABASE_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
}) : null;

async function isAdminRequest(request: Request): Promise<boolean> {
  try {
    const oauthUser = await authenticateRequest(request.headers);
    if (oauthUser?.role === "admin") return true;
  } catch {
    // The request may be using local authentication instead.
  }

  const token = cookie.parse(request.headers.get("cookie") || "")[LOCAL_AUTH_COOKIE];
  if (!token) return false;
  const localUser = await verifyLocalToken(token);
  return localUser?.role === "admin";
}

function hasValidImageSignature(contentType: string, buffer: Buffer): boolean {
  if (contentType === "image/jpeg") return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (contentType === "image/png") return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (contentType === "image/webp") return buffer.length >= 12 && buffer.subarray(0, 4).toString() === "RIFF" && buffer.subarray(8, 12).toString() === "WEBP";
  if (contentType === "image/avif") return buffer.length >= 12 && buffer.subarray(4, 8).toString() === "ftyp" && buffer.subarray(8, 12).toString().includes("avif");
  return false;
}

/* ─── Presigned Upload Endpoint ───────────────────────────────────────────
 * The browser calls this to get a signed URL, then uploads the file directly
 * to Supabase Storage.  This bypasses the Vercel 4.5 MB serverless body
 * limit because the file never passes through the serverless function.
 * ────────────────────────────────────────────────────────────────────────── */
app.post('/api/upload/presign', async (c) => {
  try {
    if (!(await isAdminRequest(c.req.raw))) {
      return c.json({ error: "Administrator access is required to upload images." }, 403);
    }

    // The metadata intentionally travels in the URL rather than a JSON body.
    // Vercel's request pipeline can consume a POST body before Hono receives
    // it, which previously left authenticated presign requests pending.
    const contentType = c.req.query("contentType") || "";
    const fileSize = Number(c.req.query("fileSize"));

    const extension = imageExtensions[contentType];
    if (!extension) {
      return c.json({ error: "Only PNG, JPEG, WEBP, and AVIF images are accepted." }, 400);
    }
    if (!fileSize || fileSize <= 0 || fileSize > MAX_UPLOAD_BYTES) {
      return c.json({ error: "File size must be between 1 byte and 10 MB." }, 400);
    }

    // ── Cloud storage: generate a Supabase signed upload URL ─────────
    if (supabaseConfigured) {
      const filename = `${randomUUID()}.${extension}`;

      const signRes = await fetch(
        `${supabaseUrl}/storage/v1/object/upload/sign/${supabaseBucket}/${filename}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${supabaseServiceKey}`,
            apikey: supabaseServiceKey!,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ upsert: false }),
        }
      );

      if (!signRes.ok) {
        const errText = await signRes.text().catch(() => "");
        console.error("Supabase signed URL error:", signRes.status, errText);
        return c.json({ error: "Failed to prepare image upload." }, 502);
      }

      const signData = await signRes.json() as { url: string };
      // Supabase returns a relative path — prefix with the project URL
      const uploadUrl = `${supabaseUrl}/storage/v1${signData.url}`;
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/${supabaseBucket}/${filename}`;

      return c.json({ uploadUrl, publicUrl });
    }

    // ── No cloud storage — tell the client to use the direct upload ──
    if (!env.isProduction) {
      return c.json({ useDirectUpload: true });
    }

    return c.json({ error: "Image storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." }, 503);
  } catch (error) {
    console.error("Presign error:", error);
    return c.json({ error: "Failed to prepare image upload." }, 500);
  }
});

/* ─── Direct Upload Endpoint (local development fallback) ─────────────── */
app.post('/api/upload', async (c) => {
  try {
    if (!(await isAdminRequest(c.req.raw))) {
      return c.json({ error: "Administrator access is required to upload images." }, 403);
    }

    const body = await c.req.parseBody();
    const file = body['file'] as File;
    
    if (!file || typeof file === 'string') {
      return c.json({ error: 'No file uploaded' }, 400);
    }

    const extension = imageExtensions[file.type];
    if (!extension || file.size === 0 || file.size > MAX_UPLOAD_BYTES) {
      return c.json({ error: "Only PNG, JPEG, WEBP, and AVIF images up to 10 MB are accepted." }, 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (!hasValidImageSignature(file.type, buffer)) {
      return c.json({ error: "The uploaded file does not match its declared image type." }, 400);
    }
    const filename = `${randomUUID()}.${extension}`;

    // Legacy S3 path (kept for backwards compat)
    if (s3Client && s3Configured) {
      const bucketName = process.env.SUPABASE_BUCKET_NAME || "images";
      const publicUrlBase = process.env.SUPABASE_PUBLIC_URL?.replace(/\/$/, "");
      if (!publicUrlBase) {
        console.error("Upload storage is configured without SUPABASE_PUBLIC_URL.");
        return c.json({ error: "Image storage is unavailable." }, 503);
      }
      await s3Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: filename,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
      }));
      return c.json({ url: `${publicUrlBase}/${bucketName}/${filename}` });
    }

    // Supabase REST API upload (server-side, for files under Vercel limit)
    if (supabaseConfigured) {
      const uploadRes = await fetch(
        `${supabaseUrl}/storage/v1/object/${supabaseBucket}/${filename}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${supabaseServiceKey}`,
            apikey: supabaseServiceKey!,
            "Content-Type": file.type || "application/octet-stream",
          },
          body: buffer,
        }
      );
      if (!uploadRes.ok) {
        const errText = await uploadRes.text().catch(() => "");
        console.error("Supabase upload error:", uploadRes.status, errText);
        return c.json({ error: "Failed to upload image to storage." }, 502);
      }
      return c.json({ url: `${supabaseUrl}/storage/v1/object/public/${supabaseBucket}/${filename}` });
    }

    if (env.isProduction) return c.json({ error: "Image storage is unavailable." }, 503);
    const filepath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filepath, buffer);
    return c.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ error: 'Failed to upload file' }, 500);
  }
});

app.all("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext: createContext as any,
  });
});

// Sitemap and Verification endpoints for Google Search Console
app.get("/sitemap.xml", sitemapHandler);
app.get("/api/sitemap.xml", sitemapHandler);
app.get("/google348ec33da0ad3145.html", (c) => c.text("google-site-verification: google348ec33da0ad3145.html"));
app.get("/google315697aa7a6970dc.html", (c) => c.text("google-site-verification: google315697aa7a6970dc.html"));
app.get("/google:code.html", (c) => {
  const code = c.req.param("code");
  return c.text(`google-site-verification: google${code}.html`);
});

app.get("/api/health", (c) => c.json({ status: "ok" }));

// For any other /api routes, return 404 (if not handled above)
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

// Universal AI Crawler & SEO HTML Prerender Engine for page navigation requests
app.get("*", async (c, next) => {
  const path = new URL(c.req.url).pathname;
  if (path.startsWith("/api/") || path === "/sitemap.xml" || path.includes(".")) {
    return next();
  }
  return seoPrerenderHandler(c);
});

export default app;

if (env.isProduction && !process.env.VERCEL) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite.js");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
