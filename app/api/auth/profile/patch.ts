import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { prettifyError } from "zod";
import { db } from "@/src/db";
import {
  type InsertUserType,
  user,
  userUpdateSchema,
} from "@/src/db/schema/auth-schema";
import { auth } from "@/src/lib/auth";
import { createResponse } from "@/src/lib/utils/createResponse";
import { hasAnyField } from "@/src/lib/utils/hasAnyField";
import { usernameSchema } from "@/src/lib/zod";

const PATH = "AUTH_PROFILE_PATCH";

export type AuthProfilePatchRequest = Partial<InsertUserType>;

export async function AuthProfilePatch(request: NextRequest) {
  // Validate Session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return createResponse(
      "invalid_session",
      "Invalid session, please log back in.",
      401,
    );
  }

  let body: AuthProfilePatchRequest;

  try {
    body = await request.json();
  } catch (error) {
    return createResponse(
      "bad_request",
      "Malformed request, expecting raw JSON.",
      400,
      undefined,
      "error",
      PATH,
      error,
    );
  }

  const forbiddenFields = [
    "id",
    "email",
    "emailVerified",
    "createdAt",
    "updatedAt",
  ];

  const isContainsForbiddenField = hasAnyField(body, forbiddenFields);

  if (isContainsForbiddenField) {
    return createResponse(
      "bad_request",
      "Request contains forbidden field",
      400,
    );
  }

  const validation = userUpdateSchema.safeParse(body);

  if (!validation.success) {
    return createResponse(
      "bad_request",
      prettifyError(validation?.error),
      400,
      validation,
    );
  }

  const isContainingUsername = hasAnyField(body, ["username"]);

  if (isContainingUsername) {
    const usernameValidation = usernameSchema.safeParse(body?.username);

    if (!usernameValidation.success) {
      return createResponse(
        "bad_request",
        prettifyError(usernameValidation?.error),
        400,
        usernameValidation,
      );
    }

    try {
      const result = await db.query.user.findFirst({
        where: eq(user.username, usernameValidation.data),
      });

      if (result) {
        return createResponse("bad_request", "Username is already taken", 409);
      }
    } catch (_error) {
      return createResponse(
        "unknown_database_error",
        "Unknown error when checking username availability",
        500,
      );
    }
  }

  try {
    const result = await db
      .update(user)
      .set(validation.data)
      .where(eq(user.id, session.user.id))
      .returning();

    return createResponse(
      "record_updated",
      `Updated user with ID:${session.user.id}, successfully.`,
      200,
      result,
    );
  } catch (error) {
    return createResponse(
      "unknown_database_error",
      "Unknown error when updating user's data",
      500,
      undefined,
      "error",
      PATH,
      error,
    );
  }
}
