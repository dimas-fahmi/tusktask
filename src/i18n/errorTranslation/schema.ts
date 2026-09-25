import { z } from "zod";
import { etm } from "./init";

export const etzs = {
  string() {
    return z.string(etm.string_invalid.construct());
  },
  string_min(min: number) {
    return this.string().trim().min(min, etm.string_min.construct(min));
  },
  string_max(max: number) {
    return this.string().trim().max(max, etm.string_max.construct(max));
  },
  string_min_max(min: number, max: number) {
    return this.string()
      .trim()
      .min(min, etm.string_min.construct(min))
      .max(max, etm.string_max.construct(max));
  },
} as const;
