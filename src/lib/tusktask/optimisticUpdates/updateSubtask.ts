import { DetailTask, SubtaskType } from "@/src/types/task";
import { QueryClient } from "@tanstack/react-query";
import { createQueryKey } from "../mutationKey/createQueryKey";
import { StandardResponse } from "../utils/createResponse";
import { TasksPatchRequest } from "@/app/api/tasks/patch";
import { CreatedByOptimisticUpdate } from "@/src/types/types";

export const updateSubtask = (
  parentKey: string | null,
  newTask: TasksPatchRequest,
  queryClient: QueryClient
) => {
  let queryKey = createQueryKey({
    branch: "task",
    structure: parentKey ?? "",
  });

  queryKey.pop();

  const oldData = queryClient.getQueryData(queryKey) as StandardResponse<
    DetailTask & CreatedByOptimisticUpdate
  >;

  if (!parentKey) {
    return { oldData };
  }

  queryClient.setQueryData(queryKey, () => {
    if (!oldData?.data) {
      return oldData;
    }

    let subtasks = [...oldData?.data?.subtasks];
    const index = subtasks.findIndex((t) => t.path === parentKey);

    if (index === -1) {
      return oldData;
    }

    subtasks[index] = {
      ...subtasks[index],
      ...newTask.newValues,
      createdByOptimisticUpdate: true,
    } as SubtaskType & CreatedByOptimisticUpdate;

    return {
      ...oldData,
      data: {
        ...oldData.data,
        subtasks,
      },
    };
  });

  return { oldData };
};
