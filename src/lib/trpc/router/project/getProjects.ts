import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { nidb } from "@/src/db";
import { etm } from "@/src/i18n/errorTranslation/init";
import { etzs } from "@/src/i18n/errorTranslation/schema";
import { sessionRequiredPlugin } from "../../plugins/sessionRequired";
import { createBaseProcedure } from "../../server/init";

const prepared = nidb.query.project
  .findMany({
    where: {
      userId: {
        eq: sql.placeholder("userId"),
      },
    },
  })
  .prepare("get_my_projects");

export const getMyProjectsProc = createBaseProcedure
  .concat(sessionRequiredPlugin().mainProc)
  .input(
    z.input(
      z.object({
        name: etzs.string_min_max(1, 28).optional(),
      }),
    ),
  )
  .query(async (opts) => {
    const { ctx } = opts;

    try {
      const result = await prepared.execute({
        userId: ctx.userId,
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
