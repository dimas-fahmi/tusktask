import { TRPCError } from "@trpc/server";
import {
  BlobNotFoundError,
  del,
  type HeadBlobResult,
  head,
} from "@vercel/blob";
import { eq } from "drizzle-orm";
import { getEnv } from "@/src/app/env";
import { AppError } from "@/src/app/error";
import { idb } from "@/src/db";
import { user } from "@/src/db/schema/t-user";
import { etm } from "@/src/i18n/errorTranslation/init";
import { isMyVercelBlob } from "@/src/utils/vercelBlobURL";
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
        if (!currentUser.image) return;

        let metadata: HeadBlobResult | null = null;
        const isVercel = isMyVercelBlob(currentUser.image);

        try {
          metadata = await head(currentUser.image, {
            token: getEnv("VERCEL_BLOB_RW_TOKEN"),
          });
        } catch (error) {
          if (!(error instanceof BlobNotFoundError) && isVercel) {
            console.error(error);
            throw new AppError(etm.unknown_error.construct());
          }
        }

        if (metadata || isVercel) {
          del(currentUser.image, {
            token: getEnv("VERCEL_BLOB_RW_TOKEN"),
          });
        }

        await tx
          .update(user)
          .set({
            image: null,
          })
          .where(eq(user.id, ctx.userId));
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
