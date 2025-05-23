import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";

import { TeamsGetResponse } from "@/app/api/teams/get";
import { fetchPersonalTeams } from "../fetchers/fetchPersonalTeams";

export interface TeamContextValues {
  teams?: TeamsGetResponse;
  isFetchingTeams: boolean;
}

const TeamContext = createContext<TeamContextValues | null>(null);

const TeamContextProvider = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  // Query Teams
  const { data: teams, isFetching: isFetchingTeams } = useQuery({
    queryKey: ["teams"],
    queryFn: () => fetchPersonalTeams(),
  });

  return (
    <TeamContext.Provider value={{ teams, isFetchingTeams }}>
      {children}
    </TeamContext.Provider>
  );
};

export { TeamContext, TeamContextProvider };
