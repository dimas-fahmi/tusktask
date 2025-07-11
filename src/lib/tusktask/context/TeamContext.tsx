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
  FullTeamMembers,
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
import useNotificationContext from "../hooks/context/useNotificationContext";
import { mutateMembership } from "../mutators/mutateMembership";
import {
  TeamMembersPatchRequest,
  TeamMembersPatchResponse,
} from "@/app/api/memberships/patch";
import { useSession } from "next-auth/react";
import { TeamMembersType } from "@/src/db/schema/teams";
import AdminRequestDialog from "@/src/ui/components/tusktask/prefabs/AdminRequestDialog";
import { UserType } from "@/src/db/schema/users";
import { TeamActions } from "@/src/types/contextBridge";
import { useRegisterActions } from "../hooks/context/register";

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
  updateMembership: UseMutateFunction<
    TeamMembersPatchResponse,
    Error,
    TeamMembersPatchRequest,
    unknown
  >;
  myMembership: TeamMembersType | null;
  adminRequestDialog: AdminDialog;
  setAdminRequestDialog: SetStateAction<AdminDialog>;
  handleResetAdminRequestDialog: () => void;
}

export interface AdminDialog {
  membership?: FullTeamMembers;
  open: boolean;
}

const TeamContext = createContext<TeamContextValues | null>(null);

const TeamContextProvider = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  // Pull session
  const { data: session } = useSession();

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
      staleTime: 1000,
    });

  const queryClient = useQueryClient();

  const teamDetail: TeamDetail | null = teamDetailResponse?.data
    ? teamDetailResponse.data
    : null;

  const myMembership = teamDetail
    ? teamDetail.teamMembers.filter((t) => t.userId === session?.user?.id)?.[0]
    : null;

  // New Team Dialog State
  const [newTeamDialogOpen, setNewTeamDialogOpen] = useState(false);

  // Team Membership Dialog State
  const [teamMembershipDialog, setTeamMembershipDialog] = useState(false);

  // Invite Member Dialog State
  const [inviteMemberDialog, setInviteMemberDialog] = useState(false);

  // Admin Request DIalog State
  const initialAdminDialog = { user: undefined, open: false };
  const [adminRequestDialog, setAdminRequestDialog] =
    useState<AdminDialog>(initialAdminDialog);

  const handleResetAdminRequestDialog = () => {
    setAdminRequestDialog(initialAdminDialog);
  };

  // Extract Teams Memberships
  const teamsMemberships = teamsResponse?.data ? teamsResponse.data : [];

  // Extract Joined Teams
  const teams = teamsResponse?.data
    ? (extractFieldValues(teamsResponse.data, "team") as FullTeam[])
    : ([] as FullTeam[]);

  const { triggerToast } = useNotificationContext();

  // Mutation [delete membership]
  const { mutate: deleteMembership } = useMutation({
    mutationKey: ["teams", "membership", "delete", teamDetailKey, userKey],
    mutationFn: deleteMembershipFn,
    onMutate: async (data) => {
      triggerToast({
        type: "default",
        title: "Removing User",
        description: `Removing a user from this team`,
      });

      queryClient.cancelQueries({
        queryKey: ["team", teamDetailKey],
      });

      const oldTeamDetail = teamDetailResponse;

      if (oldTeamDetail?.data) {
        queryClient.setQueryData(["team", teamDetailKey], () => {
          let newTeamMembers = oldTeamDetail?.data?.teamMembers.filter(
            (t) => t.userId !== data.userId
          );

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
      triggerToast({
        type: "error",
        title: "Something Went Wrong",
        description: "Failed when deleting a user from a team.",
      });

      if (context?.oldTeamDetail) {
        queryClient.setQueryData(
          ["team", teamDetailKey],
          context.oldTeamDetail
        );
      }
    },
    onSuccess: () => {
      triggerToast({
        type: "success",
        title: "You Kicked A Member",
        description: "You've just kicked a member from this team",
      });
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

  // Update : [membership]
  const { mutate: updateMembership } = useMutation({
    mutationKey: ["team", "membership", "update", teamDetailKey, userKey],
    mutationFn: mutateMembership,
    onError: (error) => {
      console.log(error);
    },
    onSettled: () => {
      setUserKey(null);
      queryClient.invalidateQueries({
        queryKey: ["team", teamDetailKey],
      });

      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });

  const teamActions: TeamActions = {
    updateMembership,
  };

  useRegisterActions("team", teamActions);

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
        updateMembership,
        myMembership,
        adminRequestDialog,
        handleResetAdminRequestDialog,
        setAdminRequestDialog,
      }}
    >
      {children}
      <NewTeamDialog />
      <TeamMembershipDialog />
      <InviteMemberDialog />
      <AdminRequestDialog />
    </TeamContext.Provider>
  );
};

export { TeamContext, TeamContextProvider };
