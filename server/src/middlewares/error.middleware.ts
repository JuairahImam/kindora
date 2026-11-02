
import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("API Error:", error);

  // If response headers are already sent
  if (res.headersSent) {
    next(error);
    return;
  }

  // Zod Validation Error
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  // Mongoose Validation Error
  if (error instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      success: false,
      message: "Database validation failed",
      errors: Object.values(error.errors).map((item) => ({
        field: item.path,
        message: item.message,
      })),
    });
    return;
  }

  // Invalid MongoDB ObjectId
  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
    return;
  }

  // MongoDB Duplicate Key Error
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    res.status(409).json({
      success: false,
      message: "Duplicate data already exists",
    });
    return;
  }

  // Generic Server Error
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : error instanceof Error
        ? error.message
        : "Something went wrong";

  res.status(500).json({
    success: false,
    message,
  });
};

export default errorMiddleware;
