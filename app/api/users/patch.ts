import { auth } from "@/auth";
import { db } from "@/src/db";
import {
  UserInsertType,
  users,
  UserType,
  UserUpdateSchema,
} from "@/src/db/schema/users";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { StandardResponse } from "@/src/lib/tusktask/utils/createResponse";
import { includeFields } from "@/src/lib/tusktask/utils/includeFields";
import sanitizeUserData, {
  SanitizedUser,
} from "@/src/lib/tusktask/utils/sanitizeUserData";
import { userSchema } from "@/src/zod/user";
import { eq } from "drizzle-orm";

export interface UsersPatchRequest {
  userId: string;
  newValue: Partial<UserInsertType>;
}

export type UsersPatchResponse = StandardResponse<SanitizedUser | null>;

export async function usersPatch(req: Request) {
  let body: UsersPatchRequest;

  // Parse Body
  try {
    body = await req.json();
  } catch (error) {
    return createNextResponse(400, {
      messages: "Invalid JSON body",
      userFriendly: false,
    });
  }

  //   Destructure body
  const { newValue, userId } = body;

  //   Pull session
  const session = await auth();

  //   Validate session
  if (!session || !session.user) {
    return createNextResponse(401, {
      messages: "Invalid Session",
      userFriendly: false,
    });
  }

  // Validate Authorization
  if (userId !== session.user.id) {
    return createNextResponse(403, {
      messages: "unauthorized to change other user's data",
      userFriendly: false,
    });
  }

  // Check if new Value contain forbidden fields
  const forbiddenFields: (keyof UserType)[] = [
    "id",
    "createdAt",
    "emailVerified",
  ];

  const includeForbiddenFields = includeFields(newValue, forbiddenFields);

  if (includeForbiddenFields.length !== 0) {
    return createNextResponse(403, {
      messages: "Contains forbidden fields",
    });
  }

  // Validate new Value
  const validation = UserUpdateSchema.safeParse(newValue);

  if (!validation.success) {
    return createNextResponse(400, {
      messages: validation.error.message,
    });
  }

  // Username Validation
  if (validation.data.username) {
    const usernameValidation = userSchema
      .pick({ username: true })
      .safeParse(validation.data);

    if (!usernameValidation.success) {
      return createNextResponse(400, {
        messages:
          usernameValidation.error?.message ?? "Username validation failed",
      });
    }

    try {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.username, usernameValidation.data.username))
        .limit(1);

      if (result.length !== 0 && result[0].id !== userId) {
        return createNextResponse(400, {
          messages: "Username is taken",
        });
      }
    } catch (error) {
      return createNextResponse(500, {
        messages: "Failed to update your data, please try again",
        userFriendly: true,
      });
    }
  }

  //   Update
  try {
    const response = await db
      .update(users)
      .set({
        ...validation.data,
        emailVerified: validation.data.email
          ? null
          : session.user.emailVerified,
      })
      .where(eq(users.id, userId))
      .returning();

    if (!response) {
      return createNextResponse(500, {
        messages: "Failed to update your data, please try again",
        userFriendly: true,
      });
    }

    return createNextResponse(200, {
      messages: "User's data updated successfully",
      userFriendly: true,
      data: sanitizeUserData(response),
    });
  } catch (error) {
    return createNextResponse(500, {
      messages: "Failed to update your data, please try again",
      userFriendly: true,
    });
  }
}
