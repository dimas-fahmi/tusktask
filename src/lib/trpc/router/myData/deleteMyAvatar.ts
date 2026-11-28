import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { AppError } from "@/src/app/error";
import { idb } from "@/src/db";
import { user } from "@/src/db/schema/t-user";
import { etm } from "@/src/i18n/errorTranslation/init";
import { deleteAvatarData } from "../../actions/deleteAvatarData";
import { sessionRequiredPlugin } from "../../plugins/sessionRequired";
import { createBaseProcedure } from "../../server/init";

export const deleteMyAvatarProc = createBaseProcedure
  .concat(sessionRequiredPlugin().mainProc)
  .mutation(async (opts) => {
    const { ctx } = opts;
    const currentUser = ctx.session.user;

    if (!currentUser.image) return true;

    try {
      await idb.transaction(async (tx) => {
        await deleteAvatarData(currentUser, tx);

        await tx
          .update(user)
          .set({
            image: null,
          })
          .where(eq(user.id, currentUser.id));
      });

      return true;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof AppError
            ? error.message
            : etm.unknown_error.construct(),
      });
    }
  });
