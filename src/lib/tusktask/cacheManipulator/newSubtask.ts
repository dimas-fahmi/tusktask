import { TaskType } from "@/src/db/schema/tasks";
import { QueryClient } from "@tanstack/react-query";
import { StandardResponse } from "../utils/createResponse";
import { DetailTask, SubtaskType } from "@/src/types/task";

export const newSubtask = async (
  parentId: string,
  newTask: Partial<TaskType>,
  queryClient: QueryClient
) => {
  const oldData = queryClient.getQueryData([
    "task",
    parentId,
  ]) as StandardResponse<DetailTask>;

  if (!oldData?.data) {
    return { oldData: undefined, success: false };
  }

  queryClient.setQueryData(["task", parentId], () => {
    if (!oldData?.data) {
      return oldData;
    }
    let subtasks = [...oldData.data.subtasks];
    subtasks.push(newTask as unknown as SubtaskType);

    return {
      ...oldData,
      data: {
        ...oldData.data,
        subtasks,
      },
    };
  });

  return { oldData, success: true };
};
