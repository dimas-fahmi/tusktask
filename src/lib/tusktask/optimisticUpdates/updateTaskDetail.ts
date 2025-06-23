import { DetailTask } from "@/src/types/task";
import { QueryClient } from "@tanstack/react-query";
import { createQueryKey } from "../mutationKey/createQueryKey";
import { StandardResponse } from "../utils/createResponse";
import { TasksPatchRequest } from "@/app/api/tasks/patch";

export const updateTaskDetail = (
  path: string | null,
  newTask: TasksPatchRequest,
  queryClient: QueryClient
) => {
  const queryKey = createQueryKey({ branch: "task", structure: path ?? "" });

  const oldData = queryClient.getQueryData(
    queryKey
  ) as StandardResponse<DetailTask>;

  if (!path) {
    return { oldData };
  }

  queryClient.setQueryData(queryKey, () => {
    if (!oldData?.data) {
      return oldData;
    }

    let data = {
      ...oldData?.data,
      ...newTask.newValues,
      createdByOptimisticUpdate: true,
    };

    return {
      ...oldData,
      data,
    };
  });

  return { oldData };
};
