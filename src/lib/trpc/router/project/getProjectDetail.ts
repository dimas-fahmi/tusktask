import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { nidb } from "@/src/db";
import { etm } from "@/src/i18n/errorTranslation/init";
import { sessionRequiredPlugin } from "../../plugins/sessionRequired";
import { createBaseProcedure } from "../../server/init";

export const getProjectDetailProc = createBaseProcedure
  .concat(sessionRequiredPlugin().mainProc)
  .input(
    z.input(
      z.object({
        id: z.uuidv7(etm.invalid_parameter.construct("id")),
      }),
    ),
  )
  .query(async (opts) => {
    const { ctx, input } = opts;
    const user = ctx.session.user;

    const result = await nidb.query.project.findFirst({
      where: {
        id: {
          eq: input.id,
        },
        userId: {
          eq: user.id,
        },
      },
    });

    if (!result) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: etm.not_found.construct(),
      });
    }

    return result;
  });
