import { handle } from "@hono/node-server/vercel";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import app from "../server/boot.js";
import { appRouter } from "../server/router.js";
import { createContext } from "../server/context.js";

const honoHandler = handle(app);

export default async function (req, res) {
  if (req.url?.startsWith("/api/trpc/")) {
    const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
    
    let body = undefined;
    if (req.method !== "GET" && req.method !== "HEAD") {
      body = (req as any).body;
      if (typeof body === "object") {
        body = JSON.stringify(body);
      } else if (body) {
        body = String(body);
      }
    }

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) {
        value.forEach(v => headers.append(key, v));
      } else if (value) {
        headers.set(key, value as string);
      }
    }

    const fetchReq = new Request(url.toString(), {
      method: req.method,
      headers,
      body,
    });

    try {
      const response = await fetchRequestHandler({
        endpoint: "/api/trpc",
        req: fetchReq,
        router: appRouter,
        createContext,
      });

      res.statusCode = response.status;
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      const responseBody = await response.text();
      res.end(responseBody);
      return;
    } catch (e) {
      console.error("TRPC Error:", e);
      res.statusCode = 500;
      res.end("Internal Server Error");
      return;
    }
  }

  return honoHandler(req, res);
}
