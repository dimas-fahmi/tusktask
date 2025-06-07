import {
  TeamMembersPatchRequest,
  TeamMembersPatchResponse,
} from "@/app/api/memberships/patch";
import createResponse from "../utils/createResponse";

export const mutateMembership = async (
  req: TeamMembersPatchRequest
): Promise<TeamMembersPatchResponse> => {
  if (!req.newValue || !req.teamId || !req.userId) {
    throw createResponse(500, {
      messages: "Missing important parameters, didn't leave the client.",
    });
  }

  try {
    const response = await fetch("/api/memberships", {
      method: "PATCH",
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
    throw error;
  }
};
