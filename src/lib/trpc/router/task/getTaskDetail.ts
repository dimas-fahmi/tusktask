import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { nidb } from "@/src/db";
import { etm } from "@/src/i18n/errorTranslation/init";
import { etzs } from "@/src/i18n/errorTranslation/schema";
import { sessionRequiredPlugin } from "../../plugins/sessionRequired";
import { createBaseProcedure } from "../../server/init";

export const getTaskDetailProc = createBaseProcedure
  .concat(sessionRequiredPlugin().mainProc)
  .input(
    z.object({
      taskId: etzs.uuidv7(undefined, "taskId"),
    }),
  )
  .query(async (opts) => {
    const { ctx, input } = opts;
    const userId = ctx.userId;

    const targetTask = await nidb.query.task.findFirst({
      where: {
        id: {
          eq: input.taskId,
        },
      },
      with: {
        category: true,
        project: true,
        user: {
          columns: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        subtasks: {
          where: {
            completedAt: {
              isNull: true,
            },
          },
        },
      },
    });

    if (!targetTask) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: etm.not_found.construct(),
      });
    }

    if (targetTask.userId !== userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: etm.unauthorized.construct(),
      });
    }

    return targetTask;
  });

export type GetTaskDetailProcResult = Awaited<
  ReturnType<typeof getTaskDetailProc>
>;
