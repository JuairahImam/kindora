
import type { Request, Response, NextFunction } from "express";

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("API Error:", error);

  const message =
    error instanceof Error
      ? error.message
      : "Something went wrong";

  res.status(500).json({
    success: false,
    message,
  });
};

export default errorMiddleware;
