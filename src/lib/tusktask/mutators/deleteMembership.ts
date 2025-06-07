import {
  TeamMembersDeleteRequest,
  TeamMembersDeleteResponse,
} from "@/app/api/memberships/delete";
import createResponse from "../utils/createResponse";

export const deleteMembership = async (
  req: TeamMembersDeleteRequest
): Promise<TeamMembersDeleteResponse> => {
  if (!req.teamId || !req.userId) {
    throw createResponse(500, {
      messages: "Missing important parameters",
    });
  }

  try {
    const response = await fetch(
      `/api/memberships?teamId=${req.teamId}&userId=${req.userId}`,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    throw error;
  }
};
