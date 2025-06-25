import { TasksPatchRequest } from "@/app/api/tasks/patch";
import { QueryClient } from "@tanstack/react-query";
import { createQueryKey } from "../mutationKey/createQueryKey";
import { StandardResponse } from "../utils/createResponse";
import { TaskType } from "@/src/db/schema/tasks";

export const updatePersonalTasks = (
  path: string | null,
  request: TasksPatchRequest,
  queryClient: QueryClient
) => {
  const keys = createQueryKey({
    branch: "task",
    structure: path ?? "",
    withBranch: false,
  });

  const oldData = queryClient.getQueryData(["tasks"]) as StandardResponse<
    TaskType[]
  >;

  if (!path || keys.length > 2) {
    return { oldData };
  }

  queryClient.setQueryData(["tasks"], () => {
    if (!oldData?.data) return oldData;

    let data = oldData.data;
    const index = data.findIndex((t) => t.id === keys.pop());

    data[index] = {
      ...data[index],
      ...request.newValues,
    };

    return {
      ...oldData,
      data,
    };
  });

  return {
    oldData,
  };
};
