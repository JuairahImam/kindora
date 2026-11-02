
import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";

import authMiddleware from "../../middlewares/auth.middleware.js";

import {
  createEventHandler,
  getAllUpcomingEventsHandler,
  getSingleEventHandler,
  getMyEventsHandler,
  updateEventHandler,
  deleteEventHandler,
  joinEventHandler,
  getMyJoinedEventsHandler,
  getRecentUpcomingEventsHandler,
} from "./event.controller.js";

import {
  createEventSchema,
  updateEventSchema,
} from "./event.validation.js";
import { getRecentUpcomingEvents } from "./event.service.js";

const router = Router();

// Create Event Validation Middleware
const validateCreateEvent = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const result = createEventSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Event validation failed",
      errors: result.error.issues,
    });
    return;
  }

  req.body = result.data;
  next();
};

// Update Event Validation Middleware
const validateUpdateEvent = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const result = updateEventSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Event validation failed",
      errors: result.error.issues,
    });
    return;
  }

  req.body = result.data;
  next();
};

// Protected Routes
router.post(
  "/",
  authMiddleware,
  validateCreateEvent,
  createEventHandler
);

router.get(
  "/my-events",
  authMiddleware,
  getMyEventsHandler
);

router.patch(
  "/:id",
  authMiddleware,
  validateUpdateEvent,
  updateEventHandler
);

router.delete(
  "/:id",
  authMiddleware,
  deleteEventHandler
);
// Join Event
router.post("/:id/join", authMiddleware, joinEventHandler);

// Get My Joined Events
router.get("/joined-events", authMiddleware, getMyJoinedEventsHandler);

// Public Routes
router.get("/", getAllUpcomingEventsHandler);
router.get("/recent", getRecentUpcomingEventsHandler);

router.get("/:id", getSingleEventHandler);

export default router;
