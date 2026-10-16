import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { nidb } from "@/src/db";
import { task } from "@/src/db/schema/t-task";
import { etm } from "@/src/i18n/errorTranslation/init";
import { etzs } from "@/src/i18n/errorTranslation/schema";
import { sessionRequiredPlugin } from "../../plugins/sessionRequired";
import { createBaseProcedure } from "../../server/init";

export const updateTaskProc = createBaseProcedure
  .concat(sessionRequiredPlugin().mainProc)
  .input(z.input(etzs.updateTaskInput()))
  .mutation(async (opts) => {
    const { ctx, input } = opts;
    const currentUser = ctx.session.user;

    const targetTask = await nidb.query.task.findFirst({
      where: {
        id: {
          eq: input.taskId,
        },
      },
    });

    if (!targetTask) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: etm.not_found.construct(),
      });
    }

    if (targetTask.userId !== currentUser.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: etm.unauthorized.construct(),
      });
    }

    await nidb
      .update(task)
      .set({
        ...input.data,
      })
      .where(eq(task.id, input.taskId))
      .catch((err) => {
        console.error(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: etm.unknown_error.construct(),
        });
      });

    return 1;
  });
