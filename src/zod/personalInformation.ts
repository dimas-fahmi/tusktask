import { z } from "zod";

// Base regex: allows letters, accents, spaces, apostrophes, hyphens
const unicodeNameRegex = /^[\p{L}\p{M}'\- ]+$/u;

// Disallowed patterns: double space, double apostrophe, double hyphen, etc.
const consecutiveSymbols = /(['\- ]{2,})/;

const nameField = z
  .string()
  .trim()
  .min(1, { message: "This field is required." })
  .max(255, { message: "Must be less than 255 characters." })
  .regex(unicodeNameRegex, { message: "Contains invalid characters." })
  .refine((val) => !consecutiveSymbols.test(val), {
    message: "Name cannot contain consecutive spaces, apostrophes, or hyphens.",
  });

export const personalInformationSchema = z.object({
  fullName: nameField,
  firstName: nameField,
  lastName: nameField,
});
