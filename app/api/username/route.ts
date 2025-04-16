import { auth } from "@/auth";
import { db } from "@/src/db";
import { users, UserType } from "@/src/db/schema/users";
import {
  createResponse,
  StandardHTTPCodeResponse,
} from "@/src/lib/tusktask/utils/createApiResponse";
import { UsernameGetApiRequest, UsernameGetApiResponse } from "@/src/types/api";
import { userNameSchema } from "@/src/zod/userName";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  let status: StandardHTTPCodeResponse;
  let response: UsernameGetApiResponse;

  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get(
      "userId"
    ) as UsernameGetApiRequest["userId"];
    const userName = url.searchParams.get(
      "username"
    ) as UsernameGetApiRequest["userName"];
    const reason = url.searchParams.get(
      "reason"
    ) as UsernameGetApiRequest["reason"];

    if (
      !userId ||
      !userName ||
      !reason ||
      !["username_availability", "lookup"].includes(reason)
    ) {
      status = 400;
      response = createResponse({
        status,
        message: "Missing Important parameters",
        userFriendly: true,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    const session = await auth();

    if (!session || !session.user) {
      status = 401;
      response = createResponse({
        status,
        message: "Invalid JSON body",
        userFriendly: true,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    let user: UserType;
    try {
      [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) {
        status = 403;
        response = createResponse({
          status,
          message:
            "Somehow you didn't exist in our database, we'll abort. Please contact support.",
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

    if (user.id !== session.user.id) {
      status = 403;
      response = createResponse({
        status,
        message: "unauthorized action, please contact support.",
        userFriendly: true,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    const usernameValidation = userNameSchema.safeParse({ userName });

    if (!usernameValidation.success) {
      status = 403;
      response = createResponse({
        status,
        message: usernameValidation.error.format(),
        userFriendly: true,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    try {
      const [result] = await db
        .select()
        .from(users)
        .where(eq(users.userName, userName))
        .limit(1);

      if (!result) {
        status = reason === "username_availability" ? 200 : 404;
        response = createResponse({
          status,
          message: "username_available",
          userFriendly: true,
          data: null,
        });

        return NextResponse.json(response, { status });
      }

      status = 200;
      response = createResponse({
        status,
        message: "username_unavailable",
        userFriendly: true,
        data: null,
      });

      return NextResponse.json(response, { status });
    } catch (error) {
      status = 500;
      response = createResponse({
        status,
        message: "Unexpected error",
        userFriendly: true,
        data: null,
      });

      return NextResponse.json(response, { status });
    }
  } catch (error) {
    status = 500;
    response = createResponse({
      status,
      message: "Something went wrong, please try again",
      userFriendly: true,
      data: null,
    });

    return NextResponse.json(response, { status });
  }
}
