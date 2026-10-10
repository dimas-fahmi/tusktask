import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { nidb } from "@/src/db";
import { task } from "@/src/db/schema/t-task";
import { etm } from "@/src/i18n/errorTranslation/init";
import { etzs } from "@/src/i18n/errorTranslation/schema";
import { sessionRequiredPlugin } from "../../plugins/sessionRequired";
import { createBaseProcedure } from "../../server/init";

export const createTaskProc = createBaseProcedure
  .concat(sessionRequiredPlugin().mainProc)
  .input(z.input(etzs.createTaskInput()))
  .mutation(async (opts) => {
    const { ctx, input } = opts;
    const user = ctx.session.user;

    const targetProject = await nidb.query.project.findFirst({
      where: {
        id: {
          eq: input.projectId,
        },
      },
    });

    if (!targetProject) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: etm.not_found.construct(),
      });
    }

    if (targetProject.userId !== user.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: etm.unauthorized.construct(),
      });
    }

    await nidb
      .insert(task)
      .values({
        userId: user.id,
        ...input,
      })
      .catch((err) => {
        console.error(err);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: etm.unknown_error.construct(),
        });
      });

    return 1;
  });
