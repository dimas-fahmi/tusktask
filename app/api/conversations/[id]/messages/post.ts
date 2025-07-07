import { auth } from "@/auth";
import { db } from "@/src/db";
import {
  ConversationMembershipType,
  conversationParticipants,
  conversations,
  ConversationType,
} from "@/src/db/schema/conversations";
import {
  messageInsertSchema,
  MessageInsertType,
  messages,
  MessageType,
} from "@/src/db/schema/messages";
import {
  NotificationInsertType,
  notifications,
} from "@/src/db/schema/notifications";
import { users } from "@/src/db/schema/users";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { StandardResponse } from "@/src/lib/tusktask/utils/createResponse";
import { CustomError } from "@/src/lib/tusktask/utils/error";
import sanitizeUserData from "@/src/lib/tusktask/utils/sanitizeUserData";
import { and, eq } from "drizzle-orm";

export interface MessagesConversationPostRequest {
  id?: undefined;
  content: string;
  respondToId?: string;
}

export type MessagesConversationPostResponse =
  StandardResponse<MessageType | null>;

export async function messagesConversationPost(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Params
  const { id } = await params;

  // Body parsing
  let body: MessagesConversationPostRequest;

  try {
    body = await req.json();
  } catch (error) {
    return createNextResponse(400, {
      messages: "Invalid body JSON",
    });
  }

  if (!body?.content) {
    return createNextResponse(400, {
      messages: "Missing important parameters",
    });
  }

  //  Session Validation
  const session = await auth();

  if (!session?.user?.id) {
    return createNextResponse(401, {
      messages: "Invalid session",
    });
  }

  // Request Validation
  const newMessage: MessageInsertType = {
    id: body?.id ?? crypto.randomUUID(),
    content: body.content,
    respondToId: body?.respondToId,
    conversationId: id,
    senderId: session.user.id,
  };
  const validation = messageInsertSchema.safeParse(newMessage);

  if (!validation.success) {
    return createNextResponse(400, {
      messages: "Failed validation phase",
      data: validation.error.errors,
    });
  }

  try {
    const result = await db.transaction(async (tx) => {
      // # Validate Membership
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
        throw new CustomError("UNAUTHORIZED", "Membership not found", 401);
      }

      let memberships: ConversationMembershipType[] | undefined;

      try {
        memberships = await tx.query.conversationParticipants.findMany({
          where: eq(conversationParticipants.conversationId, id),
        });
      } catch (error) {
        throw new CustomError(
          "DATABASE_ERROR",
          "Failed when fetching team membership"
        );
      }

      if (memberships.length < 1) {
        throw new CustomError(
          "UNEXPECTED_ERROR",
          "Something went wrong when creating broadcast",
          500
        );
      }

      // Fetch conversation
      let conversation: ConversationType | undefined;

      try {
        conversation = await tx.query.conversations.findFirst({
          where: eq(conversations.id, id),
        });
      } catch (error) {
        throw new CustomError(
          "DATABASE_ERROR",
          "Failed when fetching conversation",
          500
        );
      }

      if (!conversation) {
        throw new CustomError("BAD_REQUEST", "Conversation is not found", 404);
      }

      const broadcast: NotificationInsertType[] = await Promise.all(
        memberships
          .filter((t) => t.userId !== session.user.id)
          .map(async (m) => {
            const user = await tx.query.users.findFirst({
              where: eq(users.id, m.userId),
            });

            const not: NotificationInsertType = {
              type: "groupChat",
              senderId: session.user.id,
              receiverId: m.userId,
              category: "teams",
              teamId: conversation?.teamId,
              title: `${session.user.name} send a message on a group chat`,
              payload: {
                sender: sanitizeUserData([session.user])[0],
                content: validation.data.content,
                receiver: sanitizeUserData([user!])[0],
                conversationId: id,
              },
            };

            return not;
          })
      );

      // # Execute broadcast
      try {
        await tx.insert(notifications).values(broadcast);
      } catch (error) {
        throw new CustomError(
          "DATABASE_ERROR",
          "Failed when creating broadcast",
          500
        );
      }

      // # Update Conversation
      try {
        await tx
          .update(conversations)
          .set({ updatedAt: new Date() })
          .where(eq(conversations.id, id));
      } catch (error) {
        throw new CustomError(
          "DATABASE_ERROR",
          "Failed when register update to conversation model",
          500
        );
      }

      // # Insert
      try {
        const newRows = await tx
          .insert(messages)
          .values(validation.data)
          .returning();

        return newRows;
      } catch (error) {
        throw new CustomError(
          "DATABASE_ERROR",
          "Failed when inserting new record"
        );
      }
    });

    // END OF TRANSACTION
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
