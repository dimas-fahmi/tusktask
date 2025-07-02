import { auth } from "@/auth";
import { db } from "@/src/db";
import {
  ConversationMembershipType,
  conversationParticipants,
  conversations,
} from "@/src/db/schema/conversations";
import { UserType } from "@/src/db/schema/users";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { StandardResponse } from "@/src/lib/tusktask/utils/createResponse";
import { CustomError } from "@/src/lib/tusktask/utils/error";
import { extractFieldValues } from "@/src/lib/tusktask/utils/extractFieldValues";
import {
  ConversationDetail,
  ConversationMembershipWithUser,
  ConversationWithMessages,
} from "@/src/types/conversation";
import { and, eq } from "drizzle-orm";

export type DetailConversationGetResponse =
  StandardResponse<ConversationDetail>;

export async function detailConversationGet(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Params
  const { id } = await params;

  // Session Validation
  const session = await auth();

  if (!session?.user?.id) {
    return createNextResponse(401, {
      messages: "Invalid session",
    });
  }

  // Execution
  try {
    const result = await db.transaction(async (tx) => {
      // 1. Validate Ownership
      let membership: ConversationMembershipType | undefined;
      try {
        membership = await tx.query.conversationParticipants.findFirst({
          where: and(
            eq(conversationParticipants.conversationId, id),
            eq(conversationParticipants.userId, session.user.id)
          ),
        });
      } catch (error) {
        throw new CustomError(
          "DATABASE_ERROR",
          "FAILED WHEN FETCHING MEMBERSHIP",
          500
        );
      }

      if (!membership) {
        throw new CustomError("UNAUTHORIZED", "MEMBERSHIP NOT FOUND", 401);
      }

      // 2. Fetch Full Conversation
      let conversations_: ConversationWithMessages | undefined;

      try {
        conversations_ = await tx.query.conversations.findFirst({
          where: eq(conversations.id, id),
          with: {
            messages: true,
          },
        });
      } catch (error) {
        throw new CustomError(
          "DATABASE_ERROR",
          "FAILED WHEN FETCHING CONVERSATION",
          500
        );
      }

      // 3. Fetch Memberships
      let memberships: ConversationMembershipWithUser[] | undefined;

      try {
        memberships = (await tx.query.conversationParticipants.findMany({
          where: eq(conversationParticipants.conversationId, id),
          with: {
            user: true,
          },
        })) as ConversationMembershipWithUser[];
      } catch (error) {
        throw new CustomError(
          "DATABASE_ERROR",
          "FAILED WHEN FETCHING CONVERSATION's MEMBERSHIPS",
          500
        );
      }

      const memberships_ = extractFieldValues(
        memberships ?? [],
        "user"
      ) as UserType[];

      if (!conversations_ || !memberships_) {
        throw new CustomError(
          "DATABASE_ERROR",
          "SOMETHING WRONG WHEN FETCHING CONVERSATION AND IT's MEMBERSHIPS",
          500
        );
      }

      const result: ConversationDetail = {
        ...conversations_,
        members: memberships_,
      };

      return result;
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
      messages: "Unknown error",
    });
  }
}
