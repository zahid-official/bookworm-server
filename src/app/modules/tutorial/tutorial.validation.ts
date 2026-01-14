import z from "zod";

// Zod schema for create tutorial
export const createTutorialZodSchema = z.object({
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

  // Youtube URL
  youtubeUrl: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Youtube URL is required"
          : "Youtube URL must be a string",
    })
    .trim()
    .pipe(z.url({ error: "Youtube URL must be a valid url" })),

  // Description
  description: z
    .string({ error: "Description must be a string" })
    .max(1000, { error: "Description cannot exceed 1000 characters." })
    .trim()
    .optional(),
});

// Zod schema for update tutorial
export const updateTutorialZodSchema = z.object({
  // Title
  title: z
    .string({ error: "Title must be a string" })
    .min(2, { error: "Title must be at least 2 characters long." })
    .max(200, { error: "Title cannot exceed 200 characters." })
    .trim()
    .optional(),

  // Youtube URL
  youtubeUrl: z
    .string({ error: "Youtube URL must be a string" })
    .trim()
    .pipe(z.url({ error: "Youtube URL must be a valid url" }))
    .optional(),

  // Description
  description: z
    .string({ error: "Description must be a string" })
    .max(1000, { error: "Description cannot exceed 1000 characters." })
    .trim()
    .optional(),
});
