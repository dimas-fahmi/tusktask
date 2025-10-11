import { TasksPatchRequest } from "@/app/api/tasks/patch";
import { QueryClient } from "@tanstack/react-query";
import { StandardizeResponse } from "../../createResponse";
import { Task } from "@/src/db/schema/tasks";
import { queryKeys } from "../../queryKeys";

export interface EagerUpdateTasksProjectResult {
  oldData?: StandardizeResponse<Task[]>;
  newData?: StandardizeResponse<Task[]>;
  queryKey: string[];
}

function update(
  req: TasksPatchRequest,
  projectId: string,
  queryClient: QueryClient
): EagerUpdateTasksProjectResult {
  const queryKey = queryKeys.tasks.project(projectId);

  const oldData = queryClient.getQueryData(queryKey) as StandardizeResponse<
    Task[]
  >;

  const newData = (() => {
    if (!oldData) return oldData;

    const oldTask = oldData?.result?.find((item) => item.id === req.id);

    if (!oldTask) {
      return oldData;
    }

    const updatedTask = {
      ...oldTask,
      ...req.newValues,
    };

    const updatedList = oldData.result.map((task) =>
      task.id === req.id ? updatedTask : task
    );

    return {
      ...oldData,
      result: updatedList,
    };
  })();

  if (oldData && oldData?.result) {
    queryClient.setQueryData(queryKey, newData);
  }

  return { oldData, newData, queryKey };
}

function del(
  taskId: string,
  projectId: string,
  queryClient: QueryClient
): EagerUpdateTasksProjectResult {
  const queryKey = queryKeys.tasks.project(projectId);

  const oldData = queryClient.getQueryData(queryKey) as StandardizeResponse<
    Task[]
  >;

  const newData = (() => {
    const newList = oldData?.result?.filter((item) => item?.id !== taskId);
    console.log(newList);

    return {
      ...oldData,
      result: [...(newList ?? [])],
    };
  })();

  if (oldData) {
    queryClient.setQueryData(queryKey, newData);
  }

  return { queryKey, newData, oldData };
}

export const eagerUpdaterTasksProject = {
  update,
  del,
};
