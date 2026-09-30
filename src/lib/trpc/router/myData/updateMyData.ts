import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { ATTRIBUTION_CHANNELS_KEYS } from "@/src/app/attribution";
import { COLOR_THEME_IDS } from "@/src/app/colorTheme";
import { REGISTRATION_STEPS } from "@/src/app/registrationPhase";
import { nidb } from "@/src/db";
import { user } from "@/src/db/schema/t-user";
import { etm } from "@/src/i18n/errorTranslation/init";
import { etzs } from "@/src/i18n/errorTranslation/schema";
import { sessionRequiredPlugin } from "../../plugins/sessionRequired";
import { createBaseProcedure } from "../../server/init";

export const updateMyDataProc = createBaseProcedure
  .concat(sessionRequiredPlugin().mainProc)
  .input(
    z.input(
      z.object(
        {
          name: etzs.string_min_max(1, 255).optional(),
          username: etzs.username().optional(),
          colorThemeId: z
            .enum(
              COLOR_THEME_IDS,
              etm.invalid_parameter.construct("colorThemeId"),
            )
            .optional(),
          registrationStep: z
            .enum(
              REGISTRATION_STEPS,
              etm.invalid_parameter.construct("registrationStep"),
            )
            .optional(),
          attribution: z
            .enum(
              ATTRIBUTION_CHANNELS_KEYS,
              etm.invalid_parameter.construct("attribution"),
            )
            .optional(),
          soundNotification: z.boolean().optional(),
          soundEffect: z.boolean().optional(),
        },
        etm.object_invalid.construct(),
      ),
    ),
  )
  .mutation(async (opts) => {
    const { input, ctx } = opts;

    const exist = Object.values(input).some(
      (value) => typeof value !== "undefined",
    );

    if (!exist) return true;

    try {
      await nidb
        .update(user)
        .set({
          ...input,
        })
        .where(eq(user.id, ctx.userId));

      return true;
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: etm.unknown_error.construct(),
      });
    }
  });
