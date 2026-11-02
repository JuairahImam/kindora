import express, { type Request, type Response } from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

// Health Check API
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Kindora API is running!",
    timestamp: new Date().toISOString(),
  });
});

export default app;