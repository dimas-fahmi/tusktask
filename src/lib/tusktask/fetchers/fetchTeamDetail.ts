import { TeamDetail } from "@/src/types/team";
import createResponse, { StandardResponse } from "../utils/createResponse";

export async function fetchTeamDetail(
  id: string
): Promise<StandardResponse<TeamDetail>> {
  if (!id) {
    return createResponse(500, {
      messages: "Missing important parameters",
    });
  }

  try {
    const response = await fetch(`/api/teams/${id}`, {
      method: "GET",
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}
