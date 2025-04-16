import { z } from "zod";

export const userNameSchema = z.object({
  userName: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[a-z][a-zA-Z0-9]*(?:[_-][a-zA-Z0-9]+)*$/, {
      message:
        "Username must follow these rules:\n" +
        "- Start with a letter all lowercase\n" +
        "- Can contain letters, numbers\n" +
        "- Can contain single hyphen (-) or underscore (_) between alphanumeric characters\n" +
        "- Cannot have consecutive special characters\n" +
        "- Cannot end with special characters",
    }),
});
