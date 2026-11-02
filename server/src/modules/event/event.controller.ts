
import type { Request, Response, NextFunction } from "express";

import {
  createEvent,

  getRecentUpcomingEvents,
  getSingleEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
  joinEvent,
  getMyJoinedEvents,
  getAllUpcomingEvents,
} from "./event.service.js";

// Get Event ID safely from request params
const getEventId = (req: Request): string => {
  const id = req.params.id;

  if (typeof id !== "string") {
    throw new Error("Invalid event ID");
  }

  return id;
};

// Create Event
const createEventHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = res.locals.jwtPayload;

    const event = await createEvent({
      ...req.body,
      eventDate: new Date(req.body.eventDate),
      creatorId: user.sub,
      creatorEmail: user.email,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Upcoming Events
const getAllUpcomingEventsHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const events = await getAllUpcomingEvents();

    res.status(200).json({
      success: true,
      message: "Upcoming events retrieved successfully",
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// Get Recent 6 Upcoming Events
const getRecentUpcomingEventsHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const events = await getRecentUpcomingEvents();

    res.status(200).json({
      success: true,
      message: "Recent upcoming events retrieved successfully",
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Event
const getSingleEventHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const eventId = getEventId(req);
    const event = await getSingleEvent(eventId);

    if (!event) {
      res.status(404).json({
        success: false,
        message: "Event not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Event retrieved successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// Get My Events
const getMyEventsHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = res.locals.jwtPayload;
    const events = await getMyEvents(user.sub);

    res.status(200).json({
      success: true,
      message: "Your events retrieved successfully",
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// Update Event
const updateEventHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = res.locals.jwtPayload;

    const updatedEvent = await updateEvent(
      getEventId(req),
      user.sub,
      {
        ...req.body,
        ...(req.body.eventDate && {
          eventDate: new Date(req.body.eventDate),
        }),
      }
    );

    if (!updatedEvent) {
      res.status(404).json({
        success: false,
        message: "Event not found or you are not the owner",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Event
const deleteEventHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deletedEvent = await deleteEvent(
      getEventId(req),
      res.locals.jwtPayload.sub
    );

    if (!deletedEvent) {
      res.status(404).json({
        success: false,
        message: "Event not found or you are not the owner",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
      data: deletedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// Join Event
const joinEventHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = res.locals.jwtPayload;

    const result = await joinEvent(
      getEventId(req),
      user.sub,
      user.name,
      user.email
    );

    if (result.status === "NOT_FOUND") {
      res.status(404).json({
        success: false,
        message: "Event not found",
      });
      return;
    }

    if (result.status === "CREATOR") {
      res.status(403).json({
        success: false,
        message: "You cannot join your own event",
      });
      return;
    }

    if (result.status === "PAST_EVENT") {
      res.status(400).json({
        success: false,
        message: "You cannot join a past event",
      });
      return;
    }

    if (result.status === "ALREADY_JOINED") {
      res.status(409).json({
        success: false,
        message: "You have already joined this event",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "You have successfully joined the event",
      data: result.event,
    });
  } catch (error) {
    next(error);
  }
};

// Get My Joined Events
const getMyJoinedEventsHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = res.locals.jwtPayload;
    const events = await getMyJoinedEvents(user.sub);

    res.status(200).json({
      success: true,
      message: "Your joined events retrieved successfully",
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// Export Controllers
export {
  createEventHandler,
  getAllUpcomingEventsHandler,
  getRecentUpcomingEventsHandler,
  getSingleEventHandler,
  getMyEventsHandler,
  updateEventHandler,
  deleteEventHandler,
  joinEventHandler,
  getMyJoinedEventsHandler,
};
