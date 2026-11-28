import { del } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { getEnv } from "@/src/app/env";
import { AppError } from "@/src/app/error";
import type { AsyncTransaction } from "@/src/db";
import { image } from "@/src/db/schema/t-image";
import { type UserType, user } from "@/src/db/schema/t-user";
import { etm } from "@/src/i18n/errorTranslation/init";

export async function deleteAvatar(
  currentUser: Pick<UserType, "id"> & { image?: string | null },
  tx: AsyncTransaction,
) {
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
    .where(eq(user.id, currentUser.id));
}
