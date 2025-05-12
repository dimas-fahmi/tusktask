import { z } from "zod";

// Define the schema for the request body
export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  estimatedHours: z.number().int().nonnegative().optional(),
  estimatedMinutes: z.number().int().nonnegative().optional(),
  status: z
    .enum(["not_started", "in_progress", "completed", "archived"])
    .default("not_started"),
  visibility: z.enum(["private", "public", "shared"]).default("private"),
  startAt: z.string().optional(),
  deadlineAt: z.string().optional(),
});
