import { ConversationType } from "../db/schema/conversations";
import { UserType } from "../db/schema/users";

// Conversation

// Conversation Memberships
export interface ConversationMembershipWithConversation {
  conversation: ConversationType;
}

export interface ConversationMembershipWithUser {
  user: UserType;
}
