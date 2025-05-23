import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";

import { TeamsGetResponse } from "@/app/api/teams/get";
import { fetchPersonalTeams } from "../fetchers/fetchPersonalTeams";
import { extractFieldValues } from "../utils/extractFieldValues";
import { TeamType } from "@/src/db/schema/teams";

export interface TeamContextValues {
  teams?: TeamType[];
  isFetchingTeams: boolean;
}

const TeamContext = createContext<TeamContextValues | null>(null);

const TeamContextProvider = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  // Query Teams
  const { data: teamsResponse, isFetching: isFetchingTeams } = useQuery({
    queryKey: ["teams"],
    queryFn: () => fetchPersonalTeams(),
  });

  const teams = teamsResponse?.data
    ? (extractFieldValues(teamsResponse.data, "team") as TeamType[])
    : ([] as TeamType[]);

  return (
    <TeamContext.Provider value={{ teams, isFetchingTeams }}>
      {children}
    </TeamContext.Provider>
  );
};

export { TeamContext, TeamContextProvider };
