import { z } from "zod";
import { getMonths } from "../lib/tusktask/utils/getDate";
import useDateOptions from "../lib/tusktask/hooks/data/useDateOptions";

const months = getMonths();

export const birthDateSchema = z.object({
  month: z
    .string()
    .min(1)
    .refine((val) => months.includes(val)),
  year: z.string().min(1),
  day: z.string().min(1),
});
