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

  username(min = 3, max = 24) {
    return (
      this.string()
        // 1. Trim whitespace
        .trim()

        // 2. Must start with a lowercase letter
        .regex(/^[a-z]/, etm.username_start_rule.construct())

        // 3. Minimum 3 characters
        .min(min, etm.username_min_rule.construct(min))

        // 4. Maximum 24 characters
        .max(max, etm.username_max_rule.construct(max))

        // 5. Allowed characters: letters, numbers, underscore, hyphen, and dot
        .regex(/^[a-zA-Z0-9_.-]+$/, etm.username_char_rule.construct())

        // 6. Must end with a letter or number (not a special character)
        .regex(/[a-zA-Z0-9]$/, etm.username_end_rule.construct())

        // 7. At most one special character in total
        .refine((val) => {
          const specialCharCount = (val.match(/[_.-]/g) || []).length;
          return specialCharCount <= 1;
        }, etm.username_spec_char_rule.construct())
    );
  },
} as const;
