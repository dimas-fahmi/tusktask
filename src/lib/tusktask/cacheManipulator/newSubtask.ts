import { TaskType } from "@/src/db/schema/tasks";
import { QueryClient } from "@tanstack/react-query";
import { StandardResponse } from "../utils/createResponse";
import { DetailTask, SubtaskType } from "@/src/types/task";
import { createQueryKey } from "../mutationKey/createQueryKey";

export const newSubtask = async (
  parent: TaskType | null,
  newTask: Partial<TaskType>,
  queryClient: QueryClient
) => {
  if (!parent) return {};

  const queryKey = createQueryKey({ branch: "task", structure: parent?.path });
  const oldData = queryClient.getQueryData(
    queryKey
  ) as StandardResponse<DetailTask>;

  if (!oldData?.data) {
    return { oldData: undefined, success: false };
  }

  queryClient.setQueryData(queryKey, () => {
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
