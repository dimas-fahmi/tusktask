import { ConversationsGetResponse } from "@/app/api/conversations/get";

export const fetchConversations =
  async (): Promise<ConversationsGetResponse> => {
    const response = await fetch(`/api/conversations`, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  };
