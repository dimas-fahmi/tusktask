import { TRPCError } from "@trpc/server";
import { and, eq, type SQL, sql } from "drizzle-orm";
import { z } from "zod";
import { nidb } from "@/src/db";
import { task } from "@/src/db/schema/t-task";
import { etm } from "@/src/i18n/errorTranslation/init";
import { etzs } from "@/src/i18n/errorTranslation/schema";
import { sessionRequiredPlugin } from "../../plugins/sessionRequired";
import { createBaseProcedure } from "../../server/init";

export const getTasksProc = createBaseProcedure
  .concat(sessionRequiredPlugin().mainProc)
  .input(z.input(etzs.getTasksInput()))
  .query(async (opts) => {
    const { ctx, input } = opts;
    const currentUser = ctx.session.user;

    const where: SQL<unknown>[] = [];

    where.push(eq(task.userId, currentUser.id));

    if (input.projectId) {
      const targetProject = await nidb.query.project.findFirst({
        where: {
          id: {
            eq: input.projectId,
          },
        },

        columns: {
          userId: true,
        },
      });

      if (!targetProject || targetProject.userId !== currentUser.id) return [];

      where.push(eq(task.projectId, input.projectId));
    }

    if (input.name) {
      where.push(
        sql`to_tsvector('simple', ${task.name}) @@ to_tsquery('simple', ${input.name})`,
      );
    }

    if (input.taskCategoryId) {
      where.push(eq(task.taskCategoryId, input.taskCategoryId));
    }

    const result = await nidb
      .select()
      .from(task)
      .where(and(...where))
      .catch((err) => {
        console.error(err);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: etm.unknown_error.construct(),
        });
      });

    return result;
  });
