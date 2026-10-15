import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { nidb } from "@/src/db";
import { taskCategory } from "@/src/db/schema/t-taskCategory";
import { etm } from "@/src/i18n/errorTranslation/init";
import { sessionRequiredPlugin } from "../../plugins/sessionRequired";
import { createBaseProcedure } from "../../server/init";

export const deleteTaskCategoryProc = createBaseProcedure
  .concat(sessionRequiredPlugin().mainProc)
  .input(
    z.input(
      z.object({
        projectId: z.uuidv7(),
        taskCategoryId: z.uuidv7(),
      }),
    ),
  )
  .mutation(async (opts) => {
    const { ctx, input } = opts;
    const currentUser = ctx.session.user;

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

    if (targetProject.userId !== currentUser.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: etm.unauthorized.construct(),
      });
    }

    await nidb
      .delete(taskCategory)
      .where(eq(taskCategory.id, input.taskCategoryId))
      .catch((err) => {
        console.error(err);
      });

    return 1;
  });
