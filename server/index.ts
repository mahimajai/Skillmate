import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import { handleDemo } from "./routes/demo";
import { signup, login, logout, signout } from "./routes/auth";
import { getMe, updateMe, getStats, getByName } from "./routes/users";
import { postReport } from "./routes/report";
import {
  initiateCall,
  getPendingForUser,
  acceptCall,
  declineCall,
  endCall,
  postOffer,
  getOffer,
  postAnswer,
  getAnswer,
  postCandidate,
  getCandidates,
  getState,
} from "./routes/calls";
import { logger } from "./logger";
import { env, getAllowedOrigins } from "./env";
import { listPosts, createPost, likePost, respondPost } from "./routes/posts";

export function createServer() {
  const app = express();
  app.set("trust proxy", 1);

  // Logging
  app.use(pinoHttp({ logger }));

  // Security & performance middleware
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(compression());

  // CORS
  const allowed = getAllowedOrigins();
  app.use(
    cors({
      origin: allowed === "*" ? true : allowed,
      credentials: true,
    })
  );

  // Body parsers
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Rate limiting for API
  const callsLimiter = rateLimit({ windowMs: 60_000, max: 600 });
  const generalLimiter = rateLimit({ windowMs: 60_000, max: 100, skip: (req) => req.path.startsWith("/calls") });
  app.use("/api/calls", callsLimiter);
  app.use("/api", generalLimiter);

  // Health & readiness
  app.get("/healthz", (_req, res) => res.status(200).send("ok"));
  app.get("/readyz", (_req, res) => res.status(200).json({ status: "ready", env: env.NODE_ENV }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/report", postReport);

  // Auth routes
  app.post("/api/auth/signup", signup);
  app.post("/api/auth/login", login);
  app.post("/api/auth/logout", logout);
  app.post("/api/auth/signout", signout);

  // User profile routes
  app.get("/api/users/me", getMe);
  app.put("/api/users/me", updateMe);
  app.get("/api/users/stats", getStats);
  app.get("/api/users/by-name", getByName);

  // WebRTC signaling routes (in-memory)
  app.post("/api/calls/initiate", initiateCall);
  app.get("/api/calls/pending", getPendingForUser);
  app.post("/api/calls/accept", acceptCall);
  app.post("/api/calls/decline", declineCall);
  app.post("/api/calls/end", endCall);
  app.post("/api/calls/offer", postOffer);
  app.get("/api/calls/offer", getOffer);
  app.post("/api/calls/answer", postAnswer);
  app.get("/api/calls/answer", getAnswer);
  app.post("/api/calls/candidate", postCandidate);
  app.get("/api/calls/candidates", getCandidates);
  app.get("/api/calls/state", getState);

  // Posts routes
  app.get("/api/posts", listPosts);
  app.post("/api/posts", createPost);
  app.post("/api/posts/:id/like", likePost);
  app.post("/api/posts/:id/respond", respondPost);

  // Not found handler for API
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  // Error handler
  app.use((err: any, _req: any, res: any, _next: any) => {
    logger.error({ err }, "Unhandled error");
    res.status(500).json({ error: "Internal Server Error" });
  });

  return app;
}
