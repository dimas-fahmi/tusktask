import { auth } from "@/auth";
import { db } from "@/src/db";
import {
  conversationParticipants,
  conversations,
} from "@/src/db/schema/conversations";
import { UserType } from "@/src/db/schema/users";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { StandardResponse } from "@/src/lib/tusktask/utils/createResponse";
import { CustomError } from "@/src/lib/tusktask/utils/error";
import { extractFieldValues } from "@/src/lib/tusktask/utils/extractFieldValues";
import { ConversationMembershipWithUser } from "@/src/types/conversation";
import { eq } from "drizzle-orm";

export type ConversationMembersGetResponse = StandardResponse<
  UserType[] | null
>;

export async function conversationMembersGet(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Params
  const { id } = await params;

  //   Session validation
  const session = await auth();

  if (!session?.user?.id) {
    return createNextResponse(401, {
      messages: "Invalid session",
    });
  }

  // Fetch Conversation
  try {
    const result = await db.transaction(async (tx) => {
      //   Fetch Conversation
      let conversationMemberships: ConversationMembershipWithUser[] | undefined;

      try {
        conversationMemberships =
          (await tx.query.conversationParticipants.findMany({
            where: eq(conversationParticipants.conversationId, id),
            with: {
              user: true,
            },
          })) as ConversationMembershipWithUser[];
      } catch (error) {
        throw new CustomError(
          "DATABASE_ERROR",
          "Failed when fetching memberships",
          500
        );
      }

      // Extract Users
      const users = extractFieldValues(
        conversationMemberships,
        "user"
      ) as UserType[];

      // Validate ownership
      const userMembership = users.find((t) => t.id === session.user.id);

      if (!userMembership) {
        throw new CustomError("UNAUTHORIZED", "INSUFFICIENT_ACCESS", 403);
      }

      return users;
    });

    return createNextResponse(200, {
      messages: "success",
      data: result,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return createNextResponse(error.statusCode, {
        messages: error.message,
      });
    }

    return createNextResponse(500, {
      messages: "Unexpected and unknown error",
    });
  }
}
