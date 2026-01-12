import z from "zod";

// Zod schema for update logged user profile info
export const updateProfileInfoZodSchema = z.object({
  // Name
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Name is required"
          : "Name must be a string",
    })
    .min(2, { error: "Name must be at least 2 characters long." })
    .max(50, { error: "Name cannot exceed 50 characters." })
    .trim()
    .optional(),

  // Phone
  phone: z
    .string({ error: "Phone Number must be string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      error:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .trim()
    .optional(),

  // Address
  address: z
    .string({ error: "Address must be string" })
    .max(200, { error: "Address cannot exceed 200 characters." })
    .trim()
    .optional(),

  // Profile Photo
  profilePhoto: z
    .string({ error: "Profile Photo must be string" })
    .trim()
    .optional(),
});
