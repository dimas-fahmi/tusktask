import z from "zod";

export const nameSchema = z.string().min(1).max(100);
export const email = z.email();
export const url = z.url();
export const boolean = z.boolean();
export const usernameRegex = /^[a-z](?:[a-z0-9]*)(?:-[a-z0-9]+)?[a-z0-9]$/;
export const usernameSchema = z
  .string()
  .regex(usernameRegex, "Invalid username format");
