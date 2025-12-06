import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { prettifyError } from "zod";
import { db } from "@/src/db";
import { user } from "@/src/db/schema/auth-schema";
import type { StandardResponseType } from "@/src/lib/app/app";
import { auth } from "@/src/lib/auth";
import { rateLimiter } from "@/src/lib/redis/rateLimiter";
import { createResponse } from "@/src/lib/utils/createResponse";
import { usernameSchema } from "@/src/lib/zod";

const PATH = "AUTH_AVAILABILITY_POST";

export interface AuthAvailabilityPostRequest {
  username: string;
}

export type AuthAvailabilityPostPayload = {
  takenById?: string;
  isTakenByTheSameAccount?: boolean;
};

export type AuthAvailabilityPostResponse =
  StandardResponseType<AuthAvailabilityPostPayload>;

// Rate Limiter
const strictPolicyRateLimiter = rateLimiter();

export async function AuthAvailabilityPost(request: NextRequest) {
  // Get IP
  const ip = request.headers.get("x-real-ip") ?? "127.0.0.1";

  const rateLimitedResponse = createResponse(
    "too_many_requests",
    "You are being rate limited",
    429,
  );

  const { success: strictPolicyPassed } =
    await strictPolicyRateLimiter.limit(ip);

  if (!strictPolicyPassed) {
    return rateLimitedResponse;
  }

  // Validate session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return createResponse(
      "invalid_session",
      "Invalid session, please log back in.",
      401,
    );
  }

  let body: AuthAvailabilityPostRequest;

  try {
    body = await request.json();
  } catch (error) {
    return createResponse(
      "bad_request",
      "Malformed request, expected raw JSON.",
      400,
      undefined,
      "warn",
      PATH,
      error,
    );
  }

  if (!body?.username) {
    return createResponse(
      "bad_request",
      "Missing important parameter: username",
      400,
    );
  }

  const usernameValidation = usernameSchema.safeParse(body?.username);

  if (!usernameValidation.success) {
    return createResponse(
      "bad_request",
      prettifyError(usernameValidation?.error),
      400,
      usernameValidation,
    );
  }

  const username = usernameValidation.data;

  try {
    const result = await db.query.user.findFirst({
      where: eq(user.username, username),
    });

    if (result) {
      return createResponse<AuthAvailabilityPostPayload>(
        "resource_duplication",
        `${username} is taken`,
        200,
        {
          takenById: result.id,
          isTakenByTheSameAccount: result?.id === session?.user?.id,
        },
      );
    }

    return createResponse(
      "resource_available",
      `${username} is available`,
      200,
      undefined,
    );
  } catch (error) {
    return createResponse(
      "unknown_database_error",
      "Unknown error when fetching username availability",
      500,
      undefined,
      "error",
      PATH,
      error,
    );
  }
}
