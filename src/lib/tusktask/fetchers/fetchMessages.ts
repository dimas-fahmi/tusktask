import { MessagesConversationGetResponse } from "@/app/api/conversations/[id]/messages/get";
import createResponse from "../utils/createResponse";

export const fetchMessages = async (
  id?: string
): Promise<MessagesConversationGetResponse> => {
  if (!id) {
    throw createResponse(500, {
      messages: "Missing important parameters: [id], didn't leave the client",
    });
  }

  const response = await fetch(`/api/conversations/${id}/messages`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};
