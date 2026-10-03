import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { nidb } from "@/src/db";
import { user } from "@/src/db/schema/t-user";
import { etm } from "@/src/i18n/errorTranslation/init";
import { authProcedure } from "../../procedures/authProcedure";

const prepared = nidb
  .select()
  .from(user)
  .where(eq(user.id, sql.placeholder("id")))
  .prepare("get_my_data");

export const getMyDataProc = authProcedure
  .meta({ authRequired: false })
  .query(async (opts) => {
    try {
      if (!opts.ctx.userId) {
        return null;
      }

      const result = await prepared.execute({
        id: opts.ctx.userId,
      });

      return result[0];
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: etm.unknown_error.construct(),
      });
    }
  });
