import { auth } from "@/auth";
import { db } from "@/src/db";
import {
  ConversationMembershipType,
  conversationParticipants,
} from "@/src/db/schema/conversations";
import { messages, MessageType } from "@/src/db/schema/messages";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { StandardResponse } from "@/src/lib/tusktask/utils/createResponse";
import { CustomError } from "@/src/lib/tusktask/utils/error";
import { and, eq } from "drizzle-orm";

export type MessagesConversationGetResponse = StandardResponse<
  MessageType[] | null
>;

export async function messagesConversationGet(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Request
  const { id } = await params;

  // session
  const session = await auth();

  if (!session?.user?.id) {
    return createNextResponse(401, {
      messages: "Invalid session",
    });
  }

  try {
    const result = await db.transaction(async (tx) => {
      // 1. Validate Membership
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
          "Failed when fetching membership",
          500
        );
      }

      if (!membership) {
        throw new CustomError("UNAUTHORIZED", "MEMBERSHIP NOT FOUND", 401);
      }

      // 2. Fetch Messages
      let messages_: MessageType[] | undefined;

      try {
        messages_ = await tx.query.messages.findMany({
          where: eq(messages.conversationId, id),
        });
      } catch (error) {
        throw new CustomError(
          "DATABASE_ERROR",
          "Failed when fetching messages",
          500
        );
      }

      return messages_;
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
