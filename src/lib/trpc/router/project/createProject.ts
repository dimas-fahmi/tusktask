import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { nidb } from "@/src/db";
import { project } from "@/src/db/schema/t-project";
import { etm } from "@/src/i18n/errorTranslation/init";
import { etzs } from "@/src/i18n/errorTranslation/schema";
import { sessionRequiredPlugin } from "../../plugins/sessionRequired";
import { createBaseProcedure } from "../../server/init";

export const createProjectProc = createBaseProcedure
  .concat(sessionRequiredPlugin().mainProc)
  .input(z.input(etzs.createProjectInput()))
  .mutation(async (opts) => {
    const { ctx, input } = opts;

    try {
      await nidb.insert(project).values({
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
