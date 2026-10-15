import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { nidb } from "@/src/db";
import { taskCategory } from "@/src/db/schema/t-taskCategory";
import { etm } from "@/src/i18n/errorTranslation/init";
import { etzs } from "@/src/i18n/errorTranslation/schema";
import { sessionRequiredPlugin } from "../../plugins/sessionRequired";
import { createBaseProcedure } from "../../server/init";

export const updateTaskCategoryProc = createBaseProcedure
  .concat(sessionRequiredPlugin().mainProc)
  .input(
    z.input(
      z.object({
        projectId: z.uuidv7(),
        taskCategoryId: z.uuidv7(),
        data: z.object({
          name: etzs.string_max(48).optional(),
        }),
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
      .update(taskCategory)
      .set({
        ...input.data,
      })
      .where(eq(taskCategory.id, input.taskCategoryId))
      .catch((err) => {
        console.error(err);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: etm.unknown_error.construct(),
        });
      });

    return 1;
  });
