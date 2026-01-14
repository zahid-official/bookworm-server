import z from "zod";
import { Types } from "mongoose";
import { ReadingStatus } from "./library.interface";

// Zod schema for add book to library
export const createLibraryZodSchema = z.object({
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

  // Status
  status: z.enum(Object.values(ReadingStatus) as [string]),

  // Pages Read
  pagesRead: z
    .number({ error: "Pages read must be a number" })
    .int({ error: "Pages read must be an integer" })
    .min(0, { error: "Pages read cannot be negative." })
    .optional(),
});

// Zod schema for update library
export const updateLibraryZodSchema = z.object({
  // Status
  status: z.enum(Object.values(ReadingStatus) as [string]).optional(),

  // Pages Read
  pagesRead: z
    .number({ error: "Pages read must be a number" })
    .int({ error: "Pages read must be an integer" })
    .min(0, { error: "Pages read cannot be negative." })
    .optional(),
});
