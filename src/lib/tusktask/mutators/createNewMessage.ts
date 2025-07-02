import { MessagesConversationPostResponse } from "@/app/api/conversations/[id]/messages/post";

export const createNewMessage = async ({
  conversationId,
  content,
  respondToId,
}: {
  conversationId: string;
  content: string;
  respondToId?: string;
}): Promise<MessagesConversationPostResponse> => {
  const response = await fetch(
    `/api/conversations/${conversationId}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ content, respondToId }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};
