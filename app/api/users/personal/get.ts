import { auth } from "@/auth";
import { db } from "@/src/db";
import { users, UserType } from "@/src/db/schema/users";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { StandardResponse } from "@/src/lib/tusktask/utils/createResponse";
import { eq } from "drizzle-orm";

export type UsersPersonalGetResponse = StandardResponse<UserType>;

export async function usersPersonalGet() {
  const session = await auth();

  if (!session) {
    return createNextResponse(200, {
      messages: "Invalid session, please login",
      userFriendly: true,
    });
  }

  try {
    const [result] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id!))
      .limit(1);

    if (!result) {
      return createNextResponse(404, {
        messages: "Can't find your data",
        userFriendly: false,
        data: result,
      });
    }

    return createNextResponse(200, {
      messages: "User's data fetch",
      userFriendly: false,
      data: result,
    });
  } catch (error) {
    return createNextResponse(500, {
      messages:
        "Something went wrong when fetching your data, please try again.",
      userFriendly: true,
    });
  }
}
