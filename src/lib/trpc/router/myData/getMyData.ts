import { TRPCError } from "@trpc/server";
import { nidb } from "@/src/db";
import { etm } from "@/src/i18n/errorTranslation/init";
import { authProcedure } from "../../procedures/authProcedure";

export const getMyDataProc = authProcedure
  .meta({ authRequired: false })
  .query(async (opts) => {
    try {
      if (!opts.ctx.userId) {
        return null;
      }

      const result = await nidb.query.user.findFirst({
        where: {
          id: {
            eq: opts.ctx.userId,
          },
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
