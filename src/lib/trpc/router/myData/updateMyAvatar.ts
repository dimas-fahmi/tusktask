import { TRPCError } from "@trpc/server";
import { del, type PutBlobResult, put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getEnv } from "@/src/app/env";
import IMG_CONFIG, { isValidRawFormat } from "@/src/app/image/config";
import { idb } from "@/src/db";
import { user } from "@/src/db/schema/t-user";
import { etm } from "@/src/i18n/errorTranslation/init";
import { formatBytes } from "@/src/utils/formatBytes";
import { constructAvatarUrl, isMyVercelBlob } from "@/src/utils/vercelBlobURL";
import { sessionRequiredPlugin } from "../../plugins/sessionRequired";
import { createBaseProcedure } from "../../server/init";

export const updateMyAvatarProc = createBaseProcedure
  .concat(sessionRequiredPlugin().mainProc)
  .input(z.instanceof(FormData))
  .mutation(async (opts) => {
    const { ctx, input } = opts;
    const currentUser = ctx.session.user;

    const inputBlob = input.get("blob") as Blob;

    if (!inputBlob) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: etm.missing_parameter.construct("blob"),
      });
    }

    if (inputBlob.size > IMG_CONFIG.category.avatar.final_size) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: etm.file_too_large.construct(
          formatBytes(IMG_CONFIG.category.avatar.final_size),
        ),
      });
    }

    const img = new Bun.Image(await inputBlob.arrayBuffer());

    let metadata: Bun.Image.Metadata;

    try {
      metadata = await img.metadata();
    } catch (error) {
      console.error(error);

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: etm.file_unable_to_read.construct(),
      });
    }

    if (!isValidRawFormat(metadata.format)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: etm.file_format_unsupported.construct(
          IMG_CONFIG.format.raw.join(", "),
        ),
      });
    }

    const webp = await img
      .webp({
        quality: 80,
      })
      .blob();

    const url = constructAvatarUrl(currentUser.id);

    let uploaded: PutBlobResult | undefined;

    try {
      uploaded = await idb.transaction(async (tx) => {
        if (currentUser.image) {
          const isVercel = isMyVercelBlob(currentUser.image);

          if (isVercel) {
            await del(currentUser.image, {
              token: getEnv("VERCEL_BLOB_RW_TOKEN"),
            });
          }
        }

        await tx
          .update(user)
          .set({
            image: url.url,
          })
          .where(eq(user.id, currentUser.id));

        return await put(url.path, webp, {
          access: "public",
          token: getEnv("VERCEL_BLOB_RW_TOKEN"),
        });
      });

      if (!uploaded) throw new Error("Unknown error while uploading");
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: etm.unknown_error.construct(),
      });
    }

    return uploaded;
  });
