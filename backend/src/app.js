import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import authRoutes from "./routes/auth.js";
import apiRoutes from "./routes/index.js";
import { metricsMiddleware } from "./middleware/metrics.js";
import { notFound, errorHandler } from "./middleware/errors.js";
import { databaseReady } from "./config/database.js";
import client from "prom-client";

export const app = express();
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(metricsMiddleware);
app.get("/health", (req, res) => res.json({ status: "ok", commit: config.gitSha, database: databaseReady() ? "ready" : "not-ready" }));
app.get("/ready", (req, res) => databaseReady() ? res.json({ status: "ready" }) : res.status(503).json({ status: "not-ready" }));
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", apiRoutes);
app.use(notFound);
app.use(errorHandler);
