import { TRPCError } from "@trpc/server";
import { AppError } from "@/src/app/error";
import { idb } from "@/src/db";
import { etm } from "@/src/i18n/errorTranslation/init";
import { deleteAvatar } from "../../actions/deleteAvatar";
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
        deleteAvatar(currentUser, tx);
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
