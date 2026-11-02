
import mongoose from "mongoose";
import Event from "./event.model.js";

// Create Event
const createEvent = async (
  data: {
    title: string;
    description: string;
    eventType: string;
    thumbnail: string;
    location: string;
    eventDate: Date;
    creatorId: string;
    creatorEmail: string;
  }
) => {
  const event = await Event.create(data);
  return event;
};

// Get All Upcoming Events
const getAllUpcomingEvents = async () => {
  const events = await Event.find({
    eventDate: { $gt: new Date() },
  })
    .sort({ eventDate: 1 })
    .lean();

  return events;
};

// Get Recent 6 Upcoming Events
const getRecentUpcomingEvents = async () => {
  const events = await Event.find({
    eventDate: { $gt: new Date() },
  })
    .sort({ eventDate: 1 })
    .limit(6)
    .lean();

  return events;
};

// Get Single Event
const getSingleEvent = async (eventId: string) => {
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return null;
  }

  const event = await Event.findById(eventId).lean();
  return event;
};

// Get My Events
const getMyEvents = async (creatorId: string) => {
  const events = await Event.find({ creatorId })
    .sort({ createdAt: -1 })
    .lean();

  return events;
};

// Update Event
const updateEvent = async (
  eventId: string,
  creatorId: string,
  data: Partial<{
    title: string;
    description: string;
    eventType: string;
    thumbnail: string;
    location: string;
    eventDate: Date;
  }>
) => {
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return null;
  }

  const event = await Event.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(eventId),
      creatorId,
    },
    {
      $set: data,
    },
    {
      new: true,
      runValidators: true,
    }
  ).lean();

  return event;
};

// Delete Event
const deleteEvent = async (
  eventId: string,
  creatorId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return null;
  }

  const event = await Event.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(eventId),
    creatorId,
  });

  return event;
};

// Join Event
const joinEvent = async (
  eventId: string,
  userId: string,
  name: string,
  email: string
) => {
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return { status: "NOT_FOUND" as const };
  }

  // Check whether the event exists
  const existingEvent = await Event.findById(eventId);

  if (!existingEvent) {
    return { status: "NOT_FOUND" as const };
  }

  // Creator cannot join their own event
  if (existingEvent.creatorId === userId) {
    return { status: "CREATOR" as const };
  }

  // Event must be in the future
  if (existingEvent.eventDate <= new Date()) {
    return { status: "PAST_EVENT" as const };
  }

  // Prevent duplicate joining and update atomically
  const event = await Event.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(eventId),
      eventDate: { $gt: new Date() },
      creatorId: { $ne: userId },
      "joinedUsers.userId": { $ne: userId },
    },
    {
      $push: {
        joinedUsers: {
          userId,
          name,
          email,
          joinedAt: new Date(),
        },
      },
    },
    { new: true }
  ).lean();

  if (event) {
    return {
      status: "JOINED" as const,
      event,
    };
  }

  return { status: "ALREADY_JOINED" as const };
};

// Get My Joined Events
const getMyJoinedEvents = async (userId: string) => {
  const events = await Event.find({
    "joinedUsers.userId": userId,
  })
    .sort({ eventDate: 1 })
    .lean();

  return events;
};

// Export Services
export {
  createEvent,
  getAllUpcomingEvents,
  getRecentUpcomingEvents,
  getSingleEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
  joinEvent,
  getMyJoinedEvents,
};
