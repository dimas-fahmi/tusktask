import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { nidb } from "@/src/db";
import { project } from "@/src/db/schema/t-project";
import { etm } from "@/src/i18n/errorTranslation/init";
import { etzs } from "@/src/i18n/errorTranslation/schema";
import { sessionRequiredPlugin } from "../../plugins/sessionRequired";
import { createBaseProcedure } from "../../server/init";

export const updateProjectProc = createBaseProcedure
  .concat(sessionRequiredPlugin().mainProc)
  .input(z.input(etzs.updateProjectInput()))
  .mutation(async (opts) => {
    const { ctx, input } = opts;
    const user = ctx.session.user;
    const { id, ...data } = input;

    const target = await nidb.query.project.findFirst({
      where: {
        id: {
          eq: id,
        },
        userId: {
          eq: user.id,
        },
      },
    });

    if (!target) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: etm.not_found.construct(),
      });
    }

    await nidb
      .update(project)
      .set({
        ...data,
      })
      .where(eq(project.id, id))
      .catch((err) => {
        console.error(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: etm.unknown_error.construct(),
        });
      });

    return true;
  });
