import { auth } from "@/auth";
import { db } from "@/src/db";
import {
  conversationParticipants,
  ConversationType,
} from "@/src/db/schema/conversations";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { StandardResponse } from "@/src/lib/tusktask/utils/createResponse";
import { extractFieldValues } from "@/src/lib/tusktask/utils/extractFieldValues";
import { getSearchParams } from "@/src/lib/tusktask/utils/getSearchParams";
import { ConversationMembershipWithConversation } from "@/src/types/conversation";
import { and, eq } from "drizzle-orm";

export type ConversationsGetResponse = StandardResponse<
  ConversationType[] | null
>;

export async function conversationsGet(req: Request) {
  // Parse parameters
  const url = new URL(req.url);
  const params = getSearchParams(url, ["messages"]);

  // Session Validation
  const session = await auth();

  if (!session?.user?.id) {
    return createNextResponse(401, {
      messages: "Invalid session",
    });
  }

  let where = [];

  // Always fetch own conversations
  where.push(and(eq(conversationParticipants.userId, session.user.id)));

  // Execution
  let conversationMemberships:
    | ConversationMembershipWithConversation[]
    | undefined;

  try {
    conversationMemberships = await db.query.conversationParticipants.findMany({
      where: and(...where),
      with: {
        conversation: true,
      },
    });
  } catch (error) {
    return createNextResponse(500, {
      messages: "Failed when fetching conversations",
    });
  }

  if (!conversationMemberships) {
    return createNextResponse(404, {
      messages: "Not found",
    });
  }

  // extract conversations from memberships
  const conversations = extractFieldValues(
    conversationMemberships,
    "conversation"
  );

  return createNextResponse(200, {
    messages: "Connected to conversations GET",
    data: conversations,
  });
}
