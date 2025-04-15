import { z } from "zod";
import { getMonths } from "../lib/tusktask/utils/getDate";

const months = getMonths();

export const birthDateSchema = z
  .object({
    month: z
      .string()
      .min(1, "Month is required")
      .refine((val) => months.includes(val), {
        message: "Invalid month",
      }),
    day: z
      .string()
      .min(1, "Day is required")
      .regex(/^\d+$/, "Day must be a number")
      .transform((val) => parseInt(val, 10))
      .refine((val) => val >= 1 && val <= 31, {
        message: "Day must be between 1 and 31",
      }),
    year: z
      .string()
      .min(1, "Year is required")
      .regex(/^\d+$/, "Year must be a number")
      .transform((val) => parseInt(val, 10))
      .refine((val) => val >= 1900 && val <= new Date().getFullYear(), {
        message: `Year must not pass ${new Date().getFullYear()}`,
      }),
  })
  .refine(
    (data) => {
      // Get the number of days in the given month and year
      const monthIndex = months.indexOf(data.month);
      // Use the next month's 0th day to get the last day of the desired month
      const maxDays = new Date(data.year, monthIndex + 1, 0).getDate();
      return data.day <= maxDays;
    },
    {
      message: "Invalid day for the selected month and year",
      path: ["day"],
    }
  )
  .refine(
    (data) => {
      const birthDate = new Date(
        data.year,
        months.indexOf(data.month),
        data.day
      );
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();

      // Adjust age if birthday hasn't occurred this year
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        return age - 1 >= 7;
      }
      return age >= 7;
    },
    {
      message: "Must be at least 7 years old",
      path: ["year"],
    }
  );
