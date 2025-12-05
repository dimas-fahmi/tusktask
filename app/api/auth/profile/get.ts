import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/src/db";
import { user } from "@/src/db/schema/auth-schema";
import { auth } from "@/src/lib/auth";
import { createResponse } from "@/src/lib/utils/createResponse";

const PATH = "AUTH_PROFILE_GET";

export async function AuthProfileGet() {
  // Get & Validate Session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return createResponse(
      "invalid_session",
      "Session invalid, please re-login.",
      401,
    );
  }

  // Execute
  try {
    const result = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
    });

    if (!result) {
      return createResponse(
        "resource_not_found",
        "User's profile not found",
        404,
        undefined,
        "warn",
        PATH,
        `Requested a profile with ID:${session.user.id}, not found.`,
      );
    }

    return createResponse(
      "record_fetched",
      "User's profile found and fetched",
      200,
      result,
    );
  } catch (error) {
    return createResponse(
      "unknown_database_error",
      "Failed when fetching user profile",
      500,
      undefined,
      "error",
      PATH,
      error,
    );
  }
}
