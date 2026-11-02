
import express, { type Request, type Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

import connectDatabase from "./config/database.js";
import { auth } from "./config/auth.js";
import errorMiddleware from "./middlewares/error.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./modules/user/user.route.js";

const app = express();

// CORS Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Better Auth Handler
app.all("/api/auth/*splat", toNodeHandler(auth));

// JSON Middleware (must be before API routes)
app.use(express.json());

// MongoDB Connection Middleware
app.use(async (_req, _res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

// API Routes
app.use("/api", authRoutes);
app.use("/api/users", userRoutes);

// Health Check API
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Kindora API is running!",
    timestamp: new Date().toISOString(),
  });
});

// Centralized Error Handling
app.use(errorMiddleware);

export default app;
