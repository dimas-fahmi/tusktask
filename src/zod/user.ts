import { z } from "zod";

export const usernameRegex =
  /^(?!\d)(?!.*[-_].*[-_])[a-zA-Z0-9]+([-_][a-zA-Z0-9]+)?$/;

export const userSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().nullable(),
  username: z
    .string()
    .min(7, "Username must contain at least 7 character(s)")
    .max(38)
    .regex(usernameRegex, {
      message: `Invalid username:<br/>
1. Must be at least 3 characters<br/>
2. Cannot start with a number<br/>
3. Only one special character allowed: either '-' or '_' <br/>
4. Special character must be in the middle (not at the start or end)<br/>
5. Cannot contain both '-' and '_'`,
    }),
  notificationSoundEnable: z.boolean().optional().default(true),
  reminderSoundEnable: z.boolean().optional().default(true),
  email: z.string().email().nullable(),
  timezone: z.string().default("Asia/Jakarta"),
  emailVerified: z.date().nullable(),
  registration: z.enum([
    "username",
    "email",
    "avatar",
    "preferences",
    "complete",
  ]),
  image: z.string().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
