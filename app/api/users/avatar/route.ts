import { auth } from "@/auth";
import { MAX_IMAGE_SIZE } from "@/src/configs";
import { db } from "@/src/db";
import { users, UserType } from "@/src/db/schema/users";
import { base64ToImage } from "@/src/lib/tusktask/utils/base64ToImage";
import { convertBlobToWebP } from "@/src/lib/tusktask/utils/convertBlobToWebp";
import {
  createResponse,
  StandardHTTPCodeResponse,
} from "@/src/lib/tusktask/utils/createApiResponse";
import { resizeImageBlob } from "@/src/lib/tusktask/utils/resizeImageBlob";
import { validateImageBlob } from "@/src/lib/tusktask/utils/validateImageBlob";
import { AvatarPatchApiRequest, AvatarPatchApiResponse } from "@/src/types/api";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { del, put } from "@vercel/blob";

export async function PATCH(req: Request) {
  let status: StandardHTTPCodeResponse;
  let response: AvatarPatchApiResponse;

  try {
    let body: AvatarPatchApiRequest;

    try {
      body = await req.json();
    } catch (error) {
      status = 400;
      response = createResponse({
        status,
        message: "Invalid JSON body",
        userFriendly: false,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    const { newAvatar } = body;

    if (!newAvatar) {
      status = 400;
      response = createResponse({
        status,
        message: "Missing important parameters",
        userFriendly: false,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    const session = await auth();

    if (!session || !session.user) {
      status = 401;
      response = createResponse({
        status,
        message: "Invalid session, please log back in.",
        userFriendly: false,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    let blob: Blob;

    try {
      blob = base64ToImage(newAvatar);
    } catch (error) {
      status = 500;
      response = createResponse({
        status,
        message:
          error instanceof Error
            ? error.message
            : "Failed to convert image, please try again.",
        userFriendly: false,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    if (blob.size > MAX_IMAGE_SIZE) {
      status = 400;
      response = createResponse({
        status,
        message:
          "Image is too big, do you think I'm rich huh? can afford to store image that huge? MAX is 5MB dude!",
        userFriendly: true,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    // Validate Blob
    try {
      await validateImageBlob(blob);
    } catch (error) {
      status = 500;
      response = createResponse({
        status,
        message:
          error instanceof Error
            ? error.message
            : "Failed to validate image, please try again.",
        userFriendly: false,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    // Convert Image to webp
    let converted_image: Blob;

    try {
      converted_image = await convertBlobToWebP(blob);
    } catch (error) {
      status = 500;
      response = createResponse({
        status,
        message:
          error instanceof Error
            ? error.message
            : "Failed to convert image, please try again.",
        userFriendly: false,
        data: null,
      });

      return NextResponse.json(response, { status });
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
      status = 500;
      response = createResponse({
        status,
        message:
          error instanceof Error
            ? error.message
            : "Failed to resize image, please try again.",
        userFriendly: false,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    let user: UserType;

    try {
      [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, session!.user!.id!));

      if (!user) {
        status = 404;
        response = createResponse({
          status,
          message:
            "Something went wrong, reach out to dev and if they ask just tell them you are a ghost. They'll understand, I hope.",
          userFriendly: true,
          data: null,
        });

        return NextResponse.json(response, { status });
      }
    } catch (error) {
      status = 500;
      response = createResponse({
        status,
        message: "Failed to do important jobs, please try again.",
        userFriendly: true,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    let uploadedImageUrl: string;

    try {
      const blob = await put(
        `/tusktask/avatars/${user.id}.webp`,
        resized_image,
        {
          access: "public",
          addRandomSuffix: true,
        }
      );

      if (!blob.url) {
        status = 500;
        response = createResponse({
          status,
          message: "Something when wrong, please try again.",
          userFriendly: true,
          data: null,
        });

        return NextResponse.json(response, { status });
      }

      uploadedImageUrl = blob.url;
    } catch (error) {
      status = 500;
      response = createResponse({
        status,
        message: "Failed to upload your image, please try again.",
        userFriendly: true,
        data: error,
      });

      return NextResponse.json(response, { status });
    }

    if (
      user.image?.includes("zvgpixcwdvbogm3e.public.blob.vercel-storage.com")
    ) {
      try {
        await del(user.image);
      } catch (error) {
        status = 500;
        response = createResponse({
          status,
          message: "Failed to do important jobs, please try again.",
          userFriendly: true,
          data: null,
        });

        return NextResponse.json(response, { status });
      }
    }

    try {
      const [updatedUser] = await db
        .update(users)
        .set({
          image: uploadedImageUrl,
          updatedAt: new Date(),
        })
        .where(eq(users.id, session!.user!.id!))
        .returning();

      status = 200;
      response = createResponse({
        status,
        message: "Successfully updated your avatar.",
        userFriendly: true,
        data: uploadedImageUrl,
      });

      return NextResponse.json(response, { status });
    } catch (error) {
      await del(uploadedImageUrl);

      status = 500;
      response = createResponse({
        status,
        message: "We failed to update your profile, please try again",
        userFriendly: true,
        data: null,
      });

      return NextResponse.json(response, { status });
    }
  } catch (error) {
    status = 500;
    response = createResponse({
      status,
      message: "Something went wrong, please try again.",
      userFriendly: true,
      data: null,
    });

    return NextResponse.json(response, { status });
  }
}
