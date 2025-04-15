import { auth } from "@/auth";
import { db } from "@/src/db";
import { UserType, userUpdateSchema, users } from "@/src/db/schema/users";
import {
  createResponse,
  StandardApiResponse,
  StandardHTTPCodeResponse,
} from "@/src/lib/tusktask/utils/createApiResponse";
import { removeSensitiveFields } from "@/src/lib/tusktask/utils/removeSenstitiveFields";
import { UsersPatchApiRequest } from "@/src/types/api";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// PATCH To modified USER's records
export async function PATCH(req: Request) {
  let status: StandardHTTPCodeResponse;
  let response: StandardApiResponse<UserType | null>;

  try {
    let body: UsersPatchApiRequest;

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

    const { userId, trigger, newValue } = body;
    const session = await auth();
    const protectedFields = ["id", "email", "emailVerified", "createdAt"];
    const hasProtectedField = protectedFields.some(
      (field) => field in newValue
    );

    if (hasProtectedField) {
      status = 403;
      response = createResponse({
        status,
        message: "Contain protected field that this api can't handle.",
        userFriendly: true,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    if (!session?.user?.id) {
      status = 401;
      response = createResponse({
        status,
        message: "Unauthorized",
        userFriendly: true,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    // Authorization check based on trigger
    if (trigger === "system") {
      status = 403;
      response = createResponse({
        status,
        message: "Admin functionality is not implemented",
        userFriendly: true,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    if (trigger === "personal" && session.user.id !== userId) {
      status = 403;
      response = createResponse({
        status,
        message: "You can only update your own profile",
        userFriendly: true,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    // Fix birthDate to object
    if (typeof newValue.birthDate === "string") {
      newValue.birthDate = new Date(newValue.birthDate);
    }

    // Validate the update data using Zod schema
    const validationResult = userUpdateSchema.safeParse(newValue);

    if (!validationResult.success) {
      status = 400;
      response = createResponse({
        status,
        message: validationResult.error.format(),
        userFriendly: true,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    // Update the user in the database
    const [updatedUser] = await db
      .update(users)
      .set({
        ...validationResult.data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      status = 404;
      response = createResponse({
        status,
        message: "User not found",
        userFriendly: true,
        data: null,
      });

      return NextResponse.json(response, { status });
    }

    // Remove sensitive fields before return the response
    const safeUser = removeSensitiveFields(updatedUser);

    status = 200;
    response = createResponse({
      status,
      message: "User updated successfully",
      userFriendly: true,
      data: safeUser,
    });

    return NextResponse.json(response, { status });
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
