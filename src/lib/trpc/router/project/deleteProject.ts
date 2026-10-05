import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { nidb } from "@/src/db";
import { project } from "@/src/db/schema/t-project";
import { etm } from "@/src/i18n/errorTranslation/init";
import { sessionRequiredPlugin } from "../../plugins/sessionRequired";
import { createBaseProcedure } from "../../server/init";

export const deleteMyProjectProc = createBaseProcedure
  .concat(sessionRequiredPlugin().mainProc)
  .input(
    z.input(
      z.object({
        id: z.uuidv7(etm.invalid_parameter.construct("id")),
      }),
    ),
  )
  .mutation(async (opts) => {
    const { ctx, input } = opts;
    const user = ctx.session.user;

    const projectTarget = await nidb.query.project.findFirst({
      where: {
        id: {
          eq: input.id,
        },
      },
    });

    if (!projectTarget) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: etm.not_found.construct(),
      });
    }

    if (projectTarget.userId !== user.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: etm.unauthorized.construct(),
      });
    }

    await nidb
      .delete(project)
      .where(eq(project.id, input.id))
      .catch((error) => {
        console.error(error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: etm.unknown_error.construct(),
        });
      });

    return 1;
  });
