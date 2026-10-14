import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { generateKeyBetween } from "fractional-indexing";
import { z } from "zod";
import { idb, nidb } from "@/src/db";
import { project } from "@/src/db/schema/t-project";
import {
  type TaskCategoryInsertType,
  taskCategory,
} from "@/src/db/schema/t-taskCategory";
import { etm } from "@/src/i18n/errorTranslation/init";
import { sessionRequiredPlugin } from "../../plugins/sessionRequired";
import { createBaseProcedure } from "../../server/init";

export const createTaskCategoryProc = createBaseProcedure
  .concat(sessionRequiredPlugin().mainProc)
  .input(
    z.input(
      z.object({
        projectId: z.uuidv7(),
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

    const projectOrderKey = generateKeyBetween(
      targetProject.lastCategoryOrderKey,
      null,
    );

    const newCategory: TaskCategoryInsertType = {
      projectId: input.projectId,
      projectOrderKey,
    };

    await idb
      .transaction(async (tx) => {
        await tx
          .update(project)
          .set({
            lastCategoryOrderKey: projectOrderKey,
          })
          .where(eq(project.id, input.projectId));

        await tx.insert(taskCategory).values(newCategory);
      })
      .catch((err) => {
        console.error(err);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: etm.unknown_error.construct(),
        });
      });

    return true;
  });
