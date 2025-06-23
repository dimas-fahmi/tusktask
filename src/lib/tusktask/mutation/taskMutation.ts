import { QueryClient, useMutation } from "@tanstack/react-query";
import { mutateTaskData } from "../mutators/mutateTaskData";
import { StandardResponse } from "../utils/createResponse";
import { TeamDetail } from "@/src/types/team";
import { TasksPatchRequest } from "@/app/api/tasks/patch";
import { SetStateAction } from "@/src/types/types";
import { queriesInvalidators } from "../invalidators/queriesInvalidator";
import { createQueryKey } from "../mutationKey/createQueryKey";
import { updateTeamDetail } from "../optimisticUpdates/updateTeamDetail";

export interface UseUpdateTask {
  queryClient: QueryClient;
  teamDetailKey?: string | null;
}

export const useUpdateTask = (
  { queryClient, teamDetailKey }: UseUpdateTask,
  parentKey: string | null,
  setParentKey: SetStateAction<string | null>
) => {
  return useMutation({
    mutationFn: mutateTaskData,
    onMutate: async (data) => {
      await queryClient.cancelQueries({
        queryKey: ["team", teamDetailKey],
      });

      // Create new TeamDetail data
      const { newTeamDetail, oldTeamDetail } = updateTeamDetail(
        { queryClient, teamDetailKey },
        data
      );

      // Implement Update TeamDetail Cache
      if (newTeamDetail) {
        queryClient.setQueryData(["team", teamDetailKey], newTeamDetail);
      }

      return { oldTeamDetail };
    },
    onError: (_, __, context) => {
      // Roll Back cache if mutation failed
      if (context?.oldTeamDetail) {
        queryClient.setQueryData(
          ["team", teamDetailKey],
          context.oldTeamDetail
        );
      }
    },
    onSettled: (_, __, data) => {
      // Refetch new data from DB when settled
      queryClient.invalidateQueries({
        queryKey: ["team", teamDetailKey],
      });

      if (data?.id) {
        queryClient?.invalidateQueries({
          queryKey: ["task", data?.id],
        });
      }

      if (parentKey) {
        let keys = createQueryKey({
          branch: "task",
          structure: parentKey,
          withBranch: false,
        });
        queriesInvalidators({
          branch: "task",
          keys: keys,
          queryClient: queryClient,
        });
      }

      setParentKey(null);
    },
  });
};
