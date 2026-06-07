import type { RequestHandler } from "express";

const allowedOrigins = new Set(["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5000", "http://127.0.0.1:5000"]);

export const securityHeaders: RequestHandler = (req, res, next) => {
  const origin = req.header("Origin");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Accept,X-Demo-UserId");
  if (req.method === "OPTIONS") {
    res.status(204).send();
    return;
  }
  next();
};
