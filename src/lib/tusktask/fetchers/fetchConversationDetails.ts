import { DetailConversationGetResponse } from "@/app/api/conversations/[id]/details/get";
import createResponse from "../utils/createResponse";

export const fetchConversationDetails = async (
  id?: string
): Promise<DetailConversationGetResponse> => {
  if (!id) {
    throw createResponse(500, {
      messages: "Missing important parameters: [id], didn't leave the client",
    });
  }

  const response = await fetch(`/api/conversations/${id}/details`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};
