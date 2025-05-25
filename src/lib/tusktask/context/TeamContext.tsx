import { useQuery } from "@tanstack/react-query";
import { createContext, useState } from "react";

import { TeamWithTasksAndMembers } from "@/app/api/teams/get";
import { fetchPersonalTeams } from "../fetchers/fetchPersonalTeams";
import { extractFieldValues } from "../utils/extractFieldValues";
import { TeamMembersType } from "@/src/db/schema/teams";
import { SetStateAction } from "@/src/types/types";
import NewTeamDialog from "@/src/ui/components/tusktask/prefabs/NewTeamDialog";

export interface TeamContextValues {
  teams?: TeamWithTasksAndMembers[];
  teamsMemberships?: TeamMembersType[];
  isFetchingTeams: boolean;
  newTeamDialogOpen: boolean;
  setNewTeamDialogOpen: SetStateAction<boolean>;
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

  // New Team Dialog State
  const [newTeamDialogOpen, setNewTeamDialogOpen] = useState(false);

  // Extract Teams Memberships
  const teamsMemberships = teamsResponse?.data ? teamsResponse.data : [];

  // Extract Joined Teams
  const teams = teamsResponse?.data
    ? (extractFieldValues(
        teamsResponse.data,
        "team"
      ) as TeamWithTasksAndMembers[])
    : ([] as TeamWithTasksAndMembers[]);

  return (
    <TeamContext.Provider
      value={{
        teams,
        isFetchingTeams,
        teamsMemberships,
        newTeamDialogOpen,
        setNewTeamDialogOpen,
      }}
    >
      {children}
      <NewTeamDialog />
    </TeamContext.Provider>
  );
};

export { TeamContext, TeamContextProvider };
