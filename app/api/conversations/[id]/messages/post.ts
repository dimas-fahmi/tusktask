import { auth } from "@/auth";
import { db } from "@/src/db";
import {
  ConversationMembershipType,
  conversationParticipants,
} from "@/src/db/schema/conversations";
import {
  messageInsertSchema,
  MessageInsertType,
  messages,
  MessageType,
} from "@/src/db/schema/messages";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { StandardResponse } from "@/src/lib/tusktask/utils/createResponse";
import { CustomError } from "@/src/lib/tusktask/utils/error";
import { and, eq } from "drizzle-orm";

export interface MessagesConversationPostRequest {
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
