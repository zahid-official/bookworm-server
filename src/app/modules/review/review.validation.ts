import z from "zod";
import { Types } from "mongoose";

// Zod schema for create review
export const createReviewZodSchema = z.object({
  // Book
  bookId: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Book is required"
          : "Book must be a string",
    })
    .refine((value) => Types.ObjectId.isValid(value), {
      error: "Book must be a valid id",
    }),

  // Rating
  rating: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Rating is required"
          : "Rating must be a number",
    })
    .int({ error: "Rating must be an integer" })
    .min(1, { error: "Rating must be at least 1." })
    .max(5, { error: "Rating cannot exceed 5." }),

  // Review
  review: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Review is required"
          : "Review must be a string",
    })
    .min(5, { error: "Review must be at least 5 characters long." })
    .max(2000, { error: "Review cannot exceed 2000 characters." })
    .trim(),
});
