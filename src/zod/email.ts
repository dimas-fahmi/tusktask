import { z } from "zod";

export const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required." })
    .max(320, { message: "Email must be 320 characters or fewer." }) // per RFC spec
    .email({ message: "Invalid email address." }),
});
