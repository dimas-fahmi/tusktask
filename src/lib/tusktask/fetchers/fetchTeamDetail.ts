import createResponse from "../utils/createResponse";

export async function fetchTeamDetail(id: string) {
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
