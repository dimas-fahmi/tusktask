import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { nidb } from "@/src/db";
import { project } from "@/src/db/schema/t-project";
import { etm } from "@/src/i18n/errorTranslation/init";
import { etzs } from "@/src/i18n/errorTranslation/schema";
import { sessionRequiredPlugin } from "../../plugins/sessionRequired";
import { createBaseProcedure } from "../../server/init";

const prepared = nidb
  .insert(project)
  .values({
    userId: sql.placeholder<string>("userId"),
    name: sql.placeholder<string>("name"),
    description: sql.placeholder<string>("description"),
    iconId: sql.placeholder<string>("iconId"),
  })
  .prepare("create_project");

export const createProjectProc = createBaseProcedure
  .concat(sessionRequiredPlugin().mainProc)
  .input(
    z.input(
      z.object({
        name: etzs.string_min_max(1, 28).optional(),
        description: etzs.string_min_max(1, 255).optional().nullable(),
        iconId: etzs.string_min_max(1, 255).optional().nullable(),
      }),
    ),
  )
  .mutation(async (opts) => {
    const { ctx, input } = opts;

    try {
      await prepared.execute({
        userId: ctx.userId,
        ...input,
      });
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: etm.unknown_error.construct(),
      });
    }
  });
