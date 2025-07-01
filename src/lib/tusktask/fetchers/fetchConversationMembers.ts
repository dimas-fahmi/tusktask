import { ConversationMembersGetResponse } from "@/app/api/conversations/[id]/members/get";
import createResponse from "../utils/createResponse";

export const fetchConversationMembers = async (
  id: string
): Promise<ConversationMembersGetResponse> => {
  if (!id) {
    return createResponse(500, {
      messages: "Missing Important Parameters: [id], didn't leave the client",
    });
  }

  try {
    const response = await fetch(`/api/conversations/${id}/members`, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    throw error;
  }
};
