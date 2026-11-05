import express, { type Request, type Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

import connectDatabase from "./config/database.js";
import { auth, trustedOrigins } from "./config/auth.js";
import errorMiddleware from "./middlewares/error.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./modules/user/user.route.js";
import eventRoutes from "./modules/event/event.route.js";

const app = express();

// CORS Middleware supporting local and live client domains
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (
        !origin ||
        trustedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error(`CORS origin not allowed: ${origin}`));
      }
    },
    credentials: true,
  })
);

// GET Fallback for Social Sign-In (Redirects directly to OAuth provider)
app.get("/api/auth/sign-in/social", async (req: Request, res: Response, next) => {
  try {
    const provider = (req.query.provider as string) || "github";
    const callbackURL =
      (req.query.callbackURL as string) ||
      (req.headers.referer || "https://client-five-phi-98.vercel.app");

    const response = await auth.api.signInSocial({
      body: {
        provider: provider as "github",
        callbackURL,
      },
      asResponse: true,
    });

    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      res.setHeader("set-cookie", setCookie);
    }

    const data = await response.json();
    if (data?.url) {
      res.redirect(data.url);
    } else {
      res.status(response.status).json(data);
    }
  } catch (error) {
    next(error);
  }
});

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
app.use("/api/events", eventRoutes);

// Root API
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Kindora API is running successfully!",
    health: "/health",
  });
});

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
