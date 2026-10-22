import devServer from "@hono/vite-dev-server"
import path from "path"
const __dirname = import.meta.dirname
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { homeHtml } from "./shared/home-html"
import { localBusinessSchema, localFaqSchema, business } from "./shared/local-seo"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      name: "prerender-home-search-content",
      apply: "build",
      transformIndexHtml: {
        order: "post",
        handler(html) {
          const schemas = [localBusinessSchema, localFaqSchema, {
            "@context": "https://schema.org", "@type": "WebSite",
            "@id": `${business.url}/#website`, name: business.name, url: `${business.url}/`,
            publisher: { "@id": localBusinessSchema["@id"] },
          }];
          return html.replace('<div id="root"></div>', `<div id="root"><!--seo-content-start-->${homeHtml()}<!--seo-content-end--></div>`)
            .replace("</head>", schemas.map(schema => `<script type="application/ld+json" data-rh="true" data-seo-static="true">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`).join("\n") + "</head>");
        },
      },
    },
    devServer({ entry: "server/boot.ts", exclude: [/^\/(?!api\/).*$/] }),
    react()],
  server: {
    port: 58912,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@contracts": path.resolve(__dirname, "./contracts"),
      "@db": path.resolve(__dirname, "./db"),
      "db": path.resolve(__dirname, "./db"),
    },
  },
  envDir: path.resolve(__dirname),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router', 'framer-motion'],
          ui: ['lucide-react', 'clsx', 'tailwind-merge'],
          admin: ['exceljs'],
          schema: ['zod'],
          three: ['three']
        }
      }
    }
  },
});
