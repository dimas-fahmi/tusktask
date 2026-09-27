import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { nidb } from "@/src/db";
import type { SanitizedUserType } from "@/src/db/schema/t-user";
import { etm } from "@/src/i18n/errorTranslation/init";
import { etzs } from "@/src/i18n/errorTranslation/schema";
import { authProcedure } from "../../procedures/authProcedure";

export const getUsersProc = authProcedure
  .meta({ authRequired: false })
  .input(
    z.input(
      z.object(
        {
          username: etzs.username().optional(),
        },
        etm.object_invalid.construct(),
      ),
    ),
  )
  .query(async (opts) => {
    const { ctx, input } = opts;

    const exist = Object.values(input).some(Boolean);

    if (!exist) return [] as SanitizedUserType[];

    try {
      const result = await nidb.query.user.findMany({
        where: {
          username: {
            eq: input.username,
          },
          id: {
            notIn: ctx.userId ? [ctx.userId] : undefined,
          },
        },
        columns: {
          id: true,
          name: true,
          username: true,
          image: true,
          createdAt: true,
        },
      });

      return result;
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: etm.unknown_error.construct(),
      });
    }
  });
