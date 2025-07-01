import { ConversationType } from "../db/schema/conversations";

export interface ConversationMembershipWithConversation {
  conversation: ConversationType;
}
