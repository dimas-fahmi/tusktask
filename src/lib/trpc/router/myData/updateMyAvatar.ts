import { TRPCError } from "@trpc/server";
import { type PutBlobResult, put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getEnv } from "@/src/app/env";
import IMG_CONFIG, { isValidRawFormat } from "@/src/app/image/config";
import { idb } from "@/src/db";
import { image } from "@/src/db/schema/t-image";
import { user } from "@/src/db/schema/t-user";
import { etm } from "@/src/i18n/errorTranslation/init";
import { formatBytes } from "@/src/utils/formatBytes";
import { constructAvatarUrl } from "@/src/utils/vercelBlobURL";
import { deleteAvatarData } from "../../actions/deleteAvatarData";
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
          deleteAvatarData(currentUser, tx);
        }

        const [recordedData] = await tx
          .insert(image)
          .values({
            constructedSrc: url.url,
            size: webp.size,
            userId: currentUser.id,
            format: webp.type,
            isLocalDevelopment: process.env.NODE_ENV === "development",
          })
          .returning()
          .catch((err) => {
            console.error(err);
            throw new Error("Unknown error while creating image record");
          });

        const uploaded = await put(url.path, webp, {
          access: "public",
          token: getEnv("VERCEL_BLOB_RW_TOKEN"),
        }).catch((err) => {
          console.error(
            "Unknown error while uploading image to vercel blob",
            err,
          );

          throw new Error(etm.unknown_error.construct());
        });

        if (uploaded.url !== recordedData.constructedSrc) {
          console.error(
            "Constructed image src is not the same as uploaded one.",
          );
        }

        await tx
          .update(image)
          .set({
            src: uploaded.url,
          })
          .catch((err) => {
            console.error(
              "Failed to update image src after upload process",
              err,
            );
          });

        await tx
          .update(user)
          .set({
            image: uploaded.url,
          })
          .where(eq(user.id, currentUser.id));

        return uploaded;
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
