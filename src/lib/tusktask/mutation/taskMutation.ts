import { QueryClient, useMutation } from "@tanstack/react-query";
import { mutateTaskData } from "../mutators/mutateTaskData";
import { SetStateAction } from "@/src/types/types";
import { queriesInvalidators } from "../invalidators/queriesInvalidator";
import { createQueryKey } from "../mutationKey/createQueryKey";
import { updateTeamDetail } from "../optimisticUpdates/updateTeamDetail";
import { updateTaskDetail } from "../optimisticUpdates/updateTaskDetail";
import useNotificationContext from "../hooks/context/useNotificationContext";
import { StandardResponse } from "../utils/createResponse";
import { DetailTask } from "@/src/types/task";
import { updateSubtask } from "../optimisticUpdates/updateSubtask";

export interface UseUpdateTask {
  queryClient: QueryClient;
  teamDetailKey?: string | null;
}

export const useUpdateTask = (
  { queryClient, teamDetailKey }: UseUpdateTask,
  parentKey: string | null,
  setParentKey: SetStateAction<string | null>
) => {
  // Construct Current Key
  const currentKey = createQueryKey({
    branch: "task",
    structure: parentKey ?? "",
  });

  // Pull Notification Context
  const { triggerSound } = useNotificationContext();

  return useMutation({
    mutationFn: mutateTaskData,
    onMutate: async (data) => {
      // Trigger Sound Feedback for scratch operation
      triggerSound("positive");
      if (data?.newValues?.status === "completed") {
        triggerSound("positive");
      } else if (data?.newValues?.status === "not_started") {
        triggerSound("negative");
      }

      // Cancel Queries to prevent race condition
      await queryClient.cancelQueries({
        queryKey: ["team", teamDetailKey],
      });

      await queryClient.cancelQueries({
        queryKey: ["task"],
        exact: false,
      });

      // Create new TeamDetail data
      const { newTeamDetail, oldTeamDetail } = updateTeamDetail(
        { queryClient, teamDetailKey },
        data
      );

      // Update Old Data
      const { oldData } = updateTaskDetail(parentKey, data, queryClient);

      // Update parent subtasks
      let oldParent: StandardResponse<DetailTask> | undefined;

      if (currentKey.length > 2) {
        let { oldData } = updateSubtask(parentKey, data, queryClient);
        oldParent = oldData;
      }

      // Implement Update TeamDetail Cache
      if (newTeamDetail) {
        queryClient.setQueryData(["team", teamDetailKey], newTeamDetail);
      }

      return { oldTeamDetail, oldData, oldParent };
    },
    onError: (_, __, context) => {
      // Roll Back cache if mutation failed
      if (context?.oldTeamDetail) {
        queryClient.setQueryData(
          ["team", teamDetailKey],
          context.oldTeamDetail
        );
      }

      if (context?.oldData) {
        queryClient.setQueryData(currentKey, context.oldData);
      }

      if (context?.oldParent) {
        const parentKey = currentKey.slice(0, -1);
        queryClient.setQueryData(parentKey, context.oldParent);
      }
    },
    onSettled: (_, __, data) => {
      // Refetch new data from DB when settled
      queryClient.invalidateQueries({
        queryKey: ["team", teamDetailKey],
      });

      if (data?.id) {
        queryClient.invalidateQueries({
          queryKey: ["task", data?.id],
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

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
