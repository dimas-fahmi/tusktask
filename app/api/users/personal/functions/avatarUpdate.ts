import { auth } from "@/auth";
import { db } from "@/src/db";
import { users, UserType } from "@/src/db/schema/users";
import {
  MAX_IMAGE_SIZE,
  VERCEL_BLOB_ID,
} from "@/src/lib/tusktask/constants/configs";
import { base64ToImage } from "@/src/lib/tusktask/utils/base64ToImage";
import { convertBlobToWebP } from "@/src/lib/tusktask/utils/convertBlobToWebp";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { resizeImageBlob } from "@/src/lib/tusktask/utils/resizeImageBlob";
import { validateImageBlob } from "@/src/lib/tusktask/utils/validateImageBlob";
import { eq } from "drizzle-orm";
import { del, put } from "@vercel/blob";

export async function avatarUpdate(newAvatar: string) {
  const session = await auth();

  if (!newAvatar) {
    return createNextResponse(400, {
      messages: "missing new avatar",
    });
  }

  let blob: Blob;

  try {
    blob = base64ToImage(newAvatar);
  } catch (error) {
    return createNextResponse(500, {
      messages: "Error when parsing base64 to Image",
    });
  }

  if (blob.size > MAX_IMAGE_SIZE) {
    return createNextResponse(400, {
      messages: "Image is too big",
    });
  }

  // Validate Blob
  try {
    await validateImageBlob(blob);
  } catch (error) {
    return createNextResponse(400, {
      messages: "Failed when validating blob",
    });
  }

  // Convert Image to webp
  let converted_image: Blob;

  try {
    converted_image = await convertBlobToWebP(blob);
  } catch (error) {
    return createNextResponse(500, {
      messages: "Failed when converting your image, please try again",
      userFriendly: true,
    });
  }

  // Resized Image
  let resized_image: Blob;

  try {
    resized_image = await resizeImageBlob(converted_image, {
      width: 300,
      height: 300,
      sharpStrategy: "attention",
    });
  } catch (error) {
    return createNextResponse(500, {
      messages: "Failed when compressing your image, please try again",
      userFriendly: true,
    });
  }

  let user: UserType;

  try {
    [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session!.user.id!));

    if (!user) {
      return createNextResponse(401, {
        messages: "We can't find your data, please login to continue.",
        userFriendly: true,
      });
    }
  } catch (error) {
    return createNextResponse(500, {
      messages: "Failed when looking for your data, please try again",
      userFriendly: true,
    });
  }

  let uploadedImageUrl: string;
  try {
    const blob = await put(`/tusktask/avatars/${user.id}.webp`, resized_image, {
      access: "public",
      addRandomSuffix: true,
    });

    if (!blob.url) {
      return createNextResponse(500, {
        messages: "Something went wrong when uploading your picture",
        userFriendly: true,
      });
    }

    uploadedImageUrl = blob.url;
  } catch (error) {
    return createNextResponse(500, {
      messages: "Failed when uploading your picture",
      userFriendly: true,
    });
  }

  if (user.image && user.image?.includes(VERCEL_BLOB_ID)) {
    try {
      await del(user.image!);
    } catch (error) {
      return createNextResponse(500, {
        messages: "Failed when deleting your old avatar, please try again.",
        userFriendly: true,
      });
    }
  }

  try {
    const [updatedUser] = await db
      .update(users)
      .set({ image: uploadedImageUrl })
      .where(eq(users.id, session!.user.id!))
      .returning();

    if (!updatedUser) {
      return createNextResponse(500, {
        messages: "Unexpected error, please try again",
        userFriendly: true,
      });
    }

    return createNextResponse(200, {
      messages: "Successfully updated",
      userFriendly: false,
      data: uploadedImageUrl,
    });
  } catch (error) {
    return createNextResponse(500, {
      messages: "Failed when updating your avatar, please try again",
      userFriendly: true,
    });
  }
}
