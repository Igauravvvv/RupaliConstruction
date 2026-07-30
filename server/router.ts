import { authRouter } from "./auth-router.js";
import { localAuthRouter } from "./local-auth-router.js";
import { contactRouter } from "./contact-router.js";
import { blogRouter } from "./blog-router.js";
import { projectRouter } from "./project-router.js";
import { testimonialRouter } from "./testimonial-router.js";
import { chatRouter } from "./chat-router.js";
import { adminRouter } from "./admin-router.js";
import { createRouter, publicQuery } from "./middleware.js";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  localAuth: localAuthRouter,
  contact: contactRouter,
  blog: blogRouter,
  project: projectRouter,
  testimonial: testimonialRouter,
  chat: chatRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
