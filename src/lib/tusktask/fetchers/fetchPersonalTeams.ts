import { TeamsGetResponse } from "@/app/api/teams/get";

export const fetchPersonalTeams = async (): Promise<TeamsGetResponse> => {
  const response = await fetch("/api/teams", {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};
