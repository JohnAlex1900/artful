import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
import type { Server } from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const timestamp = () => new Date().toLocaleTimeString();

export function log(message: string, source = "express") {
  console.log(`${timestamp()} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const viteLogger = createLogger();
  const configFile = path.resolve(__dirname, "../client/vite.config.ts");

  const vite = await createViteServer({
    configFile,
    server: {
      middlewareMode: true,
      hmr: { server },
    },
    appType: "custom",
    customLogger: {
      ...viteLogger,
      error(msg, options) {
        viteLogger.error(msg, options);
      },
    },
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) {
      return next();
    }

    try {
      const indexHtmlPath = path.resolve(__dirname, "../client/index.html");
      const template = await fs.promises.readFile(indexHtmlPath, "utf-8");
      const html = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (error) {
      vite.ssrFixStacktrace(error as Error);
      next(error);
    }
  });
}

export function serveStatic(app: Express) {
  const clientDist = path.resolve(__dirname, "../client/dist");

  if (!fs.existsSync(clientDist)) {
    throw new Error(`Client build not found at ${clientDist}. Run \"cd client && npm run build\" first.`);
  }

  app.use(express.static(clientDist));

  app.use("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) {
      return next();
    }

    res.sendFile(path.resolve(clientDist, "index.html"));
  });
}
