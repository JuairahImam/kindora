
import { z } from "zod";

const eventTypes = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Education",
  "Healthcare",
  "Food Distribution",
  "Other",
] as const;

// Future Event Date Validation
const futureEventDateSchema = z.iso.datetime().refine(
  (date) => new Date(date).getTime() > Date.now(),
  {
    message: "Event date must be in the future",
  }
);

const imageValidationSchema = z.string().refine(
  (val) => /^https?:\/\//i.test(val) || val.startsWith("data:image/"),
  { message: "Must be a valid image URL or uploaded image" }
);

// Create Event Validation
const createEventSchema = z
  .object({
    title: z.string().trim().min(3).max(100),

    description: z.string().trim().min(10).max(2000),

    eventType: z.enum(eventTypes),

    thumbnail: imageValidationSchema,

    location: z.string().trim().min(3).max(150),

    eventDate: futureEventDateSchema,
  })
  .strict();

// Update Event Validation
const updateEventSchema = z
  .object({
    title: z.string().trim().min(3).max(100).optional(),

    description: z.string().trim().min(10).max(2000).optional(),

    eventType: z.enum(eventTypes).optional(),

    thumbnail: imageValidationSchema.optional(),

    location: z.string().trim().min(3).max(150).optional(),

    eventDate: futureEventDateSchema.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required for update",
  });

export {
  createEventSchema,
  updateEventSchema,
};
