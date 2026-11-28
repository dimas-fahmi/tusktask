import { TRPCError } from "@trpc/server";
import { del } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { getEnv } from "@/src/app/env";
import { AppError } from "@/src/app/error";
import { idb } from "@/src/db";
import { image } from "@/src/db/schema/t-image";
import { user } from "@/src/db/schema/t-user";
import { etm } from "@/src/i18n/errorTranslation/init";
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

        const storedImageData = await tx.query.image
          .findFirst({
            where: {
              src: {
                eq: currentUser.image,
              },
            },
          })
          .catch((err) => {
            console.error(
              "Failed to fetch image data: required for image deletion",
              err,
            );
            throw new AppError(etm.unknown_error.construct());
          });

        if (storedImageData) {
          if (storedImageData.userId === currentUser.id) {
            await tx
              .update(image)
              .set({ deletedAt: new Date() })
              .where(eq(image.id, storedImageData.id))
              .catch((err) => {
                console.error(
                  "Failed to mark image to be deleted: required for image deletion",
                  err,
                );
                throw new AppError(etm.unknown_error.construct());
              });

            del(currentUser.image, {
              token: getEnv("VERCEL_BLOB_RW_TOKEN"),
            });

            await tx
              .delete(image)
              .where(eq(image.id, storedImageData.id))
              .catch((err) => {
                console.error(
                  "Failed to delete image record: passed job to garbage collection",
                  err,
                );
              });
          }
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
