import { MutationFunction } from "@tanstack/react-query";
import { TeamsPostRequest, TeamsPostResponse } from "@/app/api/teams/post";
import createResponse from "../utils/createResponse";

export const createNewTeam: MutationFunction<
  TeamsPostResponse,
  TeamsPostRequest
> = async (request: TeamsPostRequest): Promise<TeamsPostResponse> => {
  if (!request.name || !request.type) {
    throw new Error("Missing important parameters");
  }

  const response = await fetch("/api/teams", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.messages || "Failed to create team");
  }

  return data;
};
