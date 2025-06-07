import {
  UseMutateFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createContext, useState } from "react";

import { fetchPersonalTeams } from "../fetchers/fetchPersonalTeams";
import { extractFieldValues } from "../utils/extractFieldValues";
import { SetStateAction } from "@/src/types/types";
import NewTeamDialog from "@/src/ui/components/tusktask/prefabs/NewTeamDialog";
import { fetchTeamDetail } from "../fetchers/fetchTeamDetail";
import {
  FullTeam,
  TeamDetail,
  TeamMembersWithFullTeam,
} from "@/src/types/team";
import TeamMembershipDialog from "@/src/ui/components/tusktask/prefabs/TeamMembershipDialog";
import InviteMemberDialog from "@/src/ui/components/tusktask/prefabs/InviteMemberDialog";
import { deleteMembership as deleteMembershipFn } from "../mutators/deleteMembership";
import {
  TeamMembersDeleteRequest,
  TeamMembersDeleteResponse,
} from "@/app/api/memberships/delete";

export interface TeamContextValues {
  teams?: FullTeam[];
  teamsMemberships?: TeamMembersWithFullTeam[];
  isFetchingTeams: boolean;
  newTeamDialogOpen: boolean;
  setNewTeamDialogOpen: SetStateAction<boolean>;
  teamDetail: TeamDetail | null;
  teamDetailKey: string | null;
  setTeamDetailKey: SetStateAction<string | null>;
  teamMembershipDialog: boolean;
  setTeamMembershipDialog: SetStateAction<boolean>;
  inviteMemberDialog: boolean;
  setInviteMemberDialog: SetStateAction<boolean>;
  deleteMembership: UseMutateFunction<
    TeamMembersDeleteResponse,
    Error,
    TeamMembersDeleteRequest,
    unknown
  >;
  userKey: string | null;
  setUserKey: SetStateAction<string | null>;
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

  // Team Detail key
  const [teamDetailKey, setTeamDetailKey] = useState<string | null>(null);
  const [userKey, setUserKey] = useState<string | null>(null);

  // Query team detail
  const { data: teamDetailResponse, isFetching: isFetchingTeamDetail } =
    useQuery({
      queryKey: ["team", teamDetailKey],
      queryFn: () => fetchTeamDetail(teamDetailKey!),
      enabled: !!teamDetailKey,
    });

  const queryClient = useQueryClient();

  const teamDetail: TeamDetail | null = teamDetailResponse?.data
    ? teamDetailResponse.data
    : null;

  // New Team Dialog State
  const [newTeamDialogOpen, setNewTeamDialogOpen] = useState(false);

  // Team Membership Dialog State
  const [teamMembershipDialog, setTeamMembershipDialog] = useState(false);

  // Invite Member Dialog State
  const [inviteMemberDialog, setInviteMemberDialog] = useState(false);

  // Extract Teams Memberships
  const teamsMemberships = teamsResponse?.data ? teamsResponse.data : [];

  // Extract Joined Teams
  const teams = teamsResponse?.data
    ? (extractFieldValues(teamsResponse.data, "team") as FullTeam[])
    : ([] as FullTeam[]);

  // Mutation [delete membership]
  const { mutate: deleteMembership } = useMutation({
    mutationKey: ["teams", "membership", "delete", teamDetailKey, userKey],
    mutationFn: deleteMembershipFn,
    onMutate: async (data) => {
      queryClient.invalidateQueries({});

      const oldTeamDetail = teamDetailResponse;
      setUserKey(data.userId);

      if (oldTeamDetail?.data) {
        queryClient.setQueryData(["team", teamDetailKey], () => {
          console.log(oldTeamDetail?.data?.teamMembers);
          let newTeamMembers = oldTeamDetail?.data?.teamMembers.filter(
            (t) => t.userId !== data.userId
          );
          console.log(newTeamMembers);

          return {
            ...oldTeamDetail,
            data: {
              ...oldTeamDetail.data,
              teamMembers: newTeamMembers,
            },
          };
        });
      }

      return { oldTeamDetail };
    },
    onError: (error, _, context) => {
      console.log(error);

      if (context?.oldTeamDetail) {
        queryClient.setQueryData(
          ["team", teamDetailKey],
          context.oldTeamDetail
        );
      }
    },
    onSettled: () => {
      setUserKey(null);

      queryClient.invalidateQueries({
        queryKey: ["team", teamDetailKey],
      });

      queryClient.invalidateQueries({
        queryKey: ["teams"],
      });

      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });

  return (
    <TeamContext.Provider
      value={{
        teams,
        isFetchingTeams,
        teamsMemberships,
        newTeamDialogOpen,
        setNewTeamDialogOpen,
        teamDetail,
        teamDetailKey,
        setTeamDetailKey,
        teamMembershipDialog,
        setTeamMembershipDialog,
        inviteMemberDialog,
        setInviteMemberDialog,
        deleteMembership,
        userKey,
        setUserKey,
      }}
    >
      {children}
      <NewTeamDialog />
      <TeamMembershipDialog />
      <InviteMemberDialog />
    </TeamContext.Provider>
  );
};

export { TeamContext, TeamContextProvider };
