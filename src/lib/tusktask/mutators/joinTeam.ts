import {
  TeamMembersPostRequest,
  TeamMembersPostResponse,
} from "@/app/api/memberships/post";
import createResponse from "../utils/createResponse";

export const joinTeam = async (
  req: TeamMembersPostRequest
): Promise<TeamMembersPostResponse> => {
  const { administratorId, authorizationId, teamId } = req;
  if (!administratorId || !authorizationId || !teamId) {
    throw createResponse(500, {
      messages: "Missing important parameters",
    });
  }

  try {
    const response = await fetch("/api/memberships", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(req),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    throw createResponse(500, {
      messages: "Something went wrong bray",
      data: error,
    });
  }
};
