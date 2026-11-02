
import mongoose, { Schema, type Model } from "mongoose";

// Joined user interface
interface IJoinedUser {
  userId: string;
  name: string;
  email: string;
  joinedAt: Date;
}

// Event interface
interface IEvent {
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: Date;
  creatorId: string;
  creatorEmail: string;
  joinedUsers: IJoinedUser[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Joined user schema
const joinedUserSchema = new Schema<IJoinedUser>(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

// Main event schema
const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },

    eventType: {
      type: String,
      required: true,
      enum: [
        "Cleanup",
        "Plantation",
        "Donation",
        "Education",
        "Healthcare",
        "Food Distribution",
        "Other",
      ],
    },

    thumbnail: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    eventDate: {
      type: Date,
      required: true,
    },

    creatorId: {
      type: String,
      required: true,
    },

    creatorEmail: {
      type: String,
      required: true,
      lowercase: true,
    },

    joinedUsers: {
      type: [joinedUserSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
eventSchema.index({ eventDate: 1 });
eventSchema.index({ creatorId: 1, eventDate: -1 });

// Event model
const Event: Model<IEvent> =
  (mongoose.models.Event as Model<IEvent>) ||
  mongoose.model<IEvent>("Event", eventSchema);

export default Event;
