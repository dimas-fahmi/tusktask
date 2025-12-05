import z from "zod";

export const usernameRegex = /^[a-z](?:[a-z0-9]*)(?:-[a-z0-9]+)?[a-z0-9]$/;
export const usernameSchema = z
  .string()
  .regex(usernameRegex, "Invalid username format");
