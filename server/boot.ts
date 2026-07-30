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

const app = new Hono<{ Bindings: HttpBindings }>();

// // app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
app.get(Paths.oauthCallback, createOAuthCallbackHandler());
app.route("", googleAuth);
import fs from 'fs';
import path from 'path';

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.post('/api/upload', async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body['file'];
    
    if (!file || typeof file === 'string') {
      return c.json({ error: 'No file uploaded' }, 400);
    }
    
    // Create unique filename
    const ext = file.name.split('.').pop() || 'png';
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
    const filepath = path.join(uploadDir, filename);
    
    // Save file
    const arrayBuffer = await file.arrayBuffer();
    await fs.promises.writeFile(filepath, Buffer.from(arrayBuffer));
    
    return c.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ error: 'Failed to upload file' }, 500);
  }
});

// TRPC is now handled natively in api/index.ts to bypass Vercel stream hanging issues
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

import { getDb } from "./queries/connection.js";
import { localUsers } from "../db/schema.js";
app.get('/api/test-db-write', async (c) => {
  try {
    const db = getDb();
    await db.insert(localUsers).values({
      uniqueId: 'test-' + Date.now(),
      username: 'test-' + Date.now(),
      role: 'user',
      authProvider: 'local'
    });
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

app.post('/api/test-post', async (c) => {
  try {
    const text = await c.req.text();
    return c.json({ receivedLength: text.length, body: text });
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
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
