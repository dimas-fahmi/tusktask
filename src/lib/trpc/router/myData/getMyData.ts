import { TRPCError } from "@trpc/server";
import { nidb } from "@/src/db";
import { etm } from "@/src/i18n/errorTranslation/init";
import { sessionRequiredPlugin } from "../../plugins/sessionRequired";
import { createBaseProcedure } from "../../server/init";

export const getMyDataProc = createBaseProcedure
  .concat(sessionRequiredPlugin().mainProc)
  .query(async (opts) => {
    try {
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
