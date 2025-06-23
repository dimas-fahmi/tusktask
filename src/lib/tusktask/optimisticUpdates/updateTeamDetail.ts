import { TasksPatchRequest } from "@/app/api/tasks/patch";
import { UseUpdateTask } from "../mutation/taskMutation";
import { StandardResponse } from "../utils/createResponse";
import { TeamDetail } from "@/src/types/team";

export const updateTeamDetail = (
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
