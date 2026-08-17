import { handle } from "@hono/node-server/vercel";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import app from "../server/boot.js";
import { appRouter } from "../server/router.js";
import { createContext } from "../server/context.js";

// Hono/tRPC reads the incoming stream itself. Vercel's default parser consumes
// it first, which leaves POST mutations waiting forever in production.
export const config = {
  api: {
    bodyParser: false,
  },
};

const honoHandler = handle(app);

async function readRequestBody(req: any): Promise<string | undefined> {
  if (req.method === "GET" || req.method === "HEAD") return undefined;

  // A parsed body can be supplied by a local Vercel emulator. Production uses
  // the raw stream because bodyParser is disabled above.
  try {
    const parsedBody = req.body;
    if (typeof parsedBody === "string") return parsedBody;
    if (Buffer.isBuffer(parsedBody)) return parsedBody.toString("utf8");
    if (parsedBody && typeof parsedBody === "object" && !parsedBody[Symbol.asyncIterator]) {
      return JSON.stringify(parsedBody);
    }
  } catch {
    // Vercel's body getter may reject before exposing a parsed value. Its raw
    // IncomingMessage stream is still available below.
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

export default async function handler(req: any, res: any) {
  if (!req.url?.startsWith("/api/trpc/")) {
    return honoHandler(req, res);
  }

  try {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) value.forEach((item) => headers.append(key, item));
      else if (value !== undefined) headers.set(key, String(value));
    }

    const host = headers.get("x-forwarded-host") || headers.get("host") || "localhost";
    const protocol = headers.get("x-forwarded-proto") || "https";
    const url = new URL(req.url, `${protocol}://${host}`);
    const body = await readRequestBody(req);
    const request = new Request(url, {
      method: req.method,
      headers,
      body,
    });

    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req: request,
      router: appRouter,
      createContext,
    });

    res.statusCode = response.status;
    const setCookies = (response.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie?.();
    if (setCookies?.length) res.setHeader("set-cookie", setCookies);
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "set-cookie") res.setHeader(key, value);
    });
    res.end(await response.text());
  } catch (error) {
    console.error("[tRPC] Failed to handle serverless request:", error);
    res.statusCode = 500;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ error: "Authentication service is temporarily unavailable." }));
  }
}
