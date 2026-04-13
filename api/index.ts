// Vercel serverless function — wraps the Express app
import express from "express";
import { registerRoutes } from "../server/routes";
import { createServer } from "http";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let serverReady = false;
let httpServer: any;

async function init() {
  if (!serverReady) {
    httpServer = createServer(app);
    await registerRoutes(httpServer, app);
    serverReady = true;
  }
}

export default async function handler(req: any, res: any) {
  await init();
  return app(req, res);
}
