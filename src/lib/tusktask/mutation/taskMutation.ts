import { QueryClient, useMutation } from "@tanstack/react-query";
import { mutateTaskData } from "../mutators/mutateTaskData";
import { StandardResponse } from "../utils/createResponse";
import { TeamDetail } from "@/src/types/team";
import { TasksPatchRequest } from "@/app/api/tasks/patch";

export interface UseUpdateTask {
  queryClient: QueryClient;
  teamDetailKey?: string | null;
}

const updateTeamDetail = (
  { queryClient, teamDetailKey }: UseUpdateTask,
  data: TasksPatchRequest
) => {
  const oldTeamDetail = queryClient.getQueryData([
    "team",
    teamDetailKey,
  ]) as StandardResponse<TeamDetail>;
  let newTeamDetail: StandardResponse<TeamDetail> | null = null;

  if (oldTeamDetail?.data) {
    const { id, newValues } = data;
    const updatedTasks = (oldTeamDetail?.data.tasks ?? []).map((task) =>
      task.id === id ? { ...task, ...newValues } : task
    );

    newTeamDetail = {
      ...oldTeamDetail,
      data: { ...oldTeamDetail.data, tasks: updatedTasks },
    };
  }

  return { oldTeamDetail, newTeamDetail };
};

export const useUpdateTask = ({
  queryClient,
  teamDetailKey,
}: UseUpdateTask) => {
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
    onSettled: () => {
      // Refetch new data from DB when settled
      queryClient.invalidateQueries({
        queryKey: ["team", teamDetailKey],
      });
    },
  });
};
