import { auth } from "@/auth";
import { db } from "@/src/db";
import { users, UserType } from "@/src/db/schema/users";
import {
  createResponse,
  StandardHTTPCodeResponse,
} from "@/src/lib/tusktask/utils/createApiResponse";
import { removeSensitiveFields } from "@/src/lib/tusktask/utils/removeSensititiveFields";
import {
  EmailGetApiRequest,
  EmailGetApiResponse,
  EmailPatchApiResponse,
  EmailPatchRequest,
} from "@/src/types/api";
import { emailSchema } from "@/src/zod/email";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Simple structured logger
function log(
  context: string,
  details: Record<string, any>,
  level: "info" | "warn" | "error" = "info"
) {
  const prefix = `[EmailAPI:${level.toUpperCase()}] ${context}`;
  const message = JSON.stringify(details, null, 2);
  console[level](`${prefix}\n${message}`);
}

export async function GET(req: Request) {
  let status: StandardHTTPCodeResponse;
  let response: EmailGetApiResponse;

  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email") as EmailGetApiRequest["email"];
    const userId = url.searchParams.get(
      "userId"
    ) as EmailGetApiRequest["userId"];
    const reason = url.searchParams.get(
      "reason"
    ) as EmailGetApiRequest["reason"];
    const session = await auth();

    log("Incoming Request", { userId, email, reason });

    if (!email || !userId || !reason) {
      status = 400;
      response = createResponse({
        status,
        message: "Missing Important Parameters",
        userFriendly: false,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    const validationResult = emailSchema.safeParse({ email });

    if (!validationResult.success) {
      status = 400;
      response = createResponse({
        status,
        message: validationResult.error.format(),
        userFriendly: false,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    if (!session || !session.user) {
      status = 400;
      response = createResponse({
        status,
        message: "Invalid session, please log back in.",
        userFriendly: true,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    let user: UserType;

    try {
      [user] = await db.select().from(users).where(eq(users.id, userId));

      if (!user) {
        log(
          "User Record Missing",
          {
            requestUserId: userId,
            sessionUserId: session.user.id,
            email,
            reason,
          },
          "warn"
        );

        status = 401;
        response = createResponse({
          status,
          message:
            "Somehow you didn't exist on our world, we don't know why and how is that happening. Please try again.",
          userFriendly: true,
          data: null,
        });

        return NextResponse.json(response, { status });
      }
    } catch (error) {
      log("DB Error on User Verification", { error, userId }, "error");

      status = 500;
      response = createResponse({
        status,
        message: "Failed to finish important jobs, please try again.",
        userFriendly: true,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    if (user.id !== session.user.id) {
      log(
        "Session Mismatch",
        {
          dbUserId: user.id,
          sessionUserId: session.user.id,
          email,
          reason,
        },
        "error"
      );

      status = 403;
      response = createResponse({
        status,
        message:
          "There is something weird happening, we have to reject your request. Sorry for that.",
        userFriendly: true,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    try {
      const [result] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!result) {
        log("User Not Found", { email, reason, requesterId: userId }, "info");

        status = reason === "email_availability" ? 200 : 404;
        response = createResponse({
          status,
          message:
            reason === "lookup"
              ? `We search the archived, but user with email: ${email} is not found.`
              : `email_available`,
          userFriendly: true,
          data: null,
        });

        return NextResponse.json(response, { status });
      }

      const safeUser = removeSensitiveFields(result);

      log("User Found", { email, reason, requesterId: userId }, "info");

      status = 200;
      response = createResponse({
        status,
        message:
          reason === "lookup"
            ? `We glad to tell you, we found a user with email: ${email}`
            : email === session.user.email
              ? "email_available"
              : "email_unavailable",
        userFriendly: true,
        data: safeUser,
      });

      return NextResponse.json(response, { status });
    } catch (error) {
      log("DB Error on Email Lookup", { email, error }, "error");

      status = 500;
      response = createResponse({
        status,
        message: `Somehow we can't find a user with email: ${email}, but that doesn't mean a user with that email doesn't exist. Please try again.`,
        userFriendly: true,
        data: null,
      });

      return NextResponse.json(response, { status });
    }
  } catch (error) {
    log("Unexpected Error", { error }, "error");

    status = 500;
    response = createResponse({
      status,
      message:
        "Something went wrong, please try again. If the issue persist, please contact support.",
      userFriendly: true,
      data: null,
    });

    return NextResponse.json(response, { status });
  }
}

export async function PATCH(req: Request) {
  let status: StandardHTTPCodeResponse;
  let response: EmailPatchApiResponse;

  try {
    let body: EmailPatchRequest;

    try {
      body = await req.json();
    } catch (error) {
      status = 400;
      response = createResponse({
        status,
        message: "Invalid JSON body",
        userFriendly: true,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    const { email, userId } = body;

    if (!email || !userId) {
      status = 400;
      response = createResponse({
        status,
        message: "missing important parameters",
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
        userFriendly: true,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    if (userId !== session.user.id) {
      status = 403;
      response = createResponse({
        status,
        message: "Action is unauthorized",
        userFriendly: true,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    const emailValidation = emailSchema.safeParse({ email });

    if (!emailValidation.success) {
      status = 400;
      response = createResponse({
        status,
        message: emailValidation.error.format(),
        userFriendly: true,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    try {
      const [updatedUser] = await db
        .update(users)
        .set({
          email: email,
          emailVerified: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, session.user.id))
        .returning();

      if (!updatedUser) {
        status = 500;
        response = createResponse({
          status,
          message: "Something went wrong, please try again.",
          userFriendly: true,
          data: null,
        });

        return NextResponse.json(response, { status });
      }

      const safeUser = removeSensitiveFields(updatedUser);

      status = 200;
      response = createResponse({
        status,
        message: `Update ${session.user.email} to ${email}`,
        userFriendly: true,
        data: safeUser,
      });

      return NextResponse.json(response, { status });
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
  } catch (error) {
    status = 500;
    response = createResponse({
      status,
      message:
        "Something went wrong, please try again. If the issue persist, please contact support.",
      userFriendly: true,
      data: null,
    });

    return NextResponse.json(response, { status });
  }
}
