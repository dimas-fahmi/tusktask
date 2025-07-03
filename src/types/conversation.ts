import { ConversationType } from "../db/schema/conversations";
import { MessageType } from "../db/schema/messages";
import { UserType } from "../db/schema/users";

// Conversation
export interface MessageWithCreatedByOptimisticUpdate extends MessageType {
  createdByOptimisticUpdate?: boolean;
}

export interface ConversationWithMessages extends ConversationType {
  messages: MessageWithCreatedByOptimisticUpdate[];
}

export interface ConversationWithMembers extends ConversationType {
  members: UserType[];
}

export type ConversationDetail = ConversationWithMessages &
  ConversationWithMembers;

// Conversation Memberships
export interface ConversationMembershipWithConversation {
  conversation: ConversationType;
}

export interface ConversationMembershipWithUser {
  user: UserType;
}
