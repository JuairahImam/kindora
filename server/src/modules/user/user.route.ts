
import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";

import authMiddleware from "../../middlewares/auth.middleware.js";
import {
  getMyProfile,
  updateMyProfile,
} from "./user.controller.js";

const router = Router();

// Profile update validation
const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2).max(50).optional(),
    image: z.string().url().optional(),
  })
  .refine(
    (data) => data.name !== undefined || data.image !== undefined,
    {
      message: "At least one field (name or image) is required",
    }
  );

// Validation middleware
const validateProfileUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const result = updateProfileSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.issues,
    });
    return;
  }

  req.body = result.data;
  next();
};

// GET: My profile
router.get("/me", authMiddleware, getMyProfile);

// PATCH: Update my profile
router.patch(
  "/me",
  authMiddleware,
  validateProfileUpdate,
  updateMyProfile
);

export default router;
