import z from "zod";

// Zod schema for create genre
export const createGenreZodSchema = z.object({
  // Name
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Genre name is required"
          : "Genre name must be a string",
    })
    .min(2, { error: "Genre name must be at least 2 characters long." })
    .max(50, { error: "Genre name cannot exceed 50 characters." })
    .trim()
    .transform((value) => value.toUpperCase()),

  // Description
  description: z
    .string({ error: "Genre description must be a string" })
    .max(500, { error: "Genre description cannot exceed 500 characters." })
    .trim()
    .optional(),
});

// Zod schema for update genre
export const updateGenreZodSchema = z.object({
  // Name
  name: z
    .string({ error: "Genre name must be a string" })
    .min(2, { error: "Genre name must be at least 2 characters long." })
    .max(50, { error: "Genre name cannot exceed 50 characters." })
    .trim()
    .transform((value) => value.toUpperCase())
    .optional(),

  // Description
  description: z
    .string({ error: "Genre description must be a string" })
    .max(500, { error: "Genre description cannot exceed 500 characters." })
    .trim()
    .optional(),
});
