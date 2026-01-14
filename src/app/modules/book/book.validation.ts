import z from "zod";
import { Types } from "mongoose";

// Zod schema for create book
export const createBookZodSchema = z.object({
  // Title
  title: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Title is required"
          : "Title must be a string",
    })
    .min(2, { error: "Title must be at least 2 characters long." })
    .max(200, { error: "Title cannot exceed 200 characters." })
    .trim(),

  // Author
  author: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Author is required"
          : "Author must be a string",
    })
    .min(2, { error: "Author must be at least 2 characters long." })
    .max(100, { error: "Author cannot exceed 100 characters." })
    .trim(),

  // Genre
  genre: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Genre is required"
          : "Genre must be a string",
    })
    .refine((value) => Types.ObjectId.isValid(value), {
      error: "Genre must be a valid id",
    }),

  // Description
  description: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Description is required"
          : "Description must be a string",
    })
    .min(10, { error: "Description must be at least 10 characters long." })
    .max(2000, { error: "Description cannot exceed 2000 characters." })
    .trim(),

  // Cover Image
  coverImage: z
    .string({ error: "Cover image must be a string" })
    .trim()
    .optional(),

  // Pages
  pages: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Pages is required"
          : "Pages must be a number",
    })
    .int({ error: "Pages must be an integer" })
    .min(1, { error: "Pages must be at least 1." }),
});

// Zod schema for update book
export const updateBookZodSchema = z.object({
  // Title
  title: z
    .string({ error: "Title must be a string" })
    .min(2, { error: "Title must be at least 2 characters long." })
    .max(200, { error: "Title cannot exceed 200 characters." })
    .trim()
    .optional(),

  // Author
  author: z
    .string({ error: "Author must be a string" })
    .min(2, { error: "Author must be at least 2 characters long." })
    .max(100, { error: "Author cannot exceed 100 characters." })
    .trim()
    .optional(),

  // Genre
  genre: z
    .string({ error: "Genre must be a string" })
    .refine((value) => Types.ObjectId.isValid(value), {
      error: "Genre must be a valid id",
    })
    .optional(),

  // Description
  description: z
    .string({ error: "Description must be a string" })
    .min(10, { error: "Description must be at least 10 characters long." })
    .max(2000, { error: "Description cannot exceed 2000 characters." })
    .trim()
    .optional(),

  // Cover Image
  coverImage: z
    .string({ error: "Cover image must be a string" })
    .trim()
    .optional(),

  // Pages
  pages: z
    .number({ error: "Pages must be a number" })
    .int({ error: "Pages must be an integer" })
    .min(1, { error: "Pages must be at least 1." })
    .optional(),
});
