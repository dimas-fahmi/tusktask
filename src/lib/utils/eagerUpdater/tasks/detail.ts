import { TasksPatchRequest } from "@/app/api/tasks/patch";
import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import { StandardizeResponse } from "../../createResponse";
import { Task } from "@/src/db/schema/tasks";
import { EagerUpdaterResult } from "@/src/lib/types/eagerUpdate";
import { TaskApp } from "@/src/lib/types/tasks";

const update = (
  req: TasksPatchRequest,
  queryClient: QueryClient
): EagerUpdaterResult<Task> => {
  const queryKey = queryKeys.tasks.detail(req?.id);

  const oldData = queryClient.getQueryData(
    queryKey
  ) as StandardizeResponse<Task>;

  const newData = (() => {
    if (!oldData) return oldData;

    const oldTask = oldData?.result;

    if (!oldTask) return oldData;

    const newTask = {
      ...oldTask,
      ...req?.newValues,
    };

    document.title = `${req?.newValues?.name || oldTask?.name} | TuskTask`;

    return {
      ...oldData,
      result: newTask,
    };
  })();

  if (oldData) {
    queryClient.setQueryData(queryKey, newData);
  }

  return { oldData, newData, queryKey };
};

const updateSubtasksList = (
  req: TasksPatchRequest,
  queryClient: QueryClient,
  parentTaskId?: string | null
) => {
  if (!parentTaskId) return;

  const queryKey = queryKeys.tasks.detail(parentTaskId);

  const oldData = queryClient.getQueryData(
    queryKey
  ) as StandardizeResponse<TaskApp>;

  const newData = (() => {
    if (!oldData?.result) return oldData;

    const oldSubtasks = oldData?.result?.subtasks;

    if (!oldSubtasks || !oldSubtasks?.length) return oldData;

    const oldTask = oldSubtasks.find((item) => item.id === req?.id);

    if (!oldTask) return oldData;

    const newTask = {
      ...oldTask,
      ...req?.newValues,
    };

    const newList = oldSubtasks.map((item) =>
      item.id === req?.id ? newTask : item
    );

    return {
      ...oldData,
      result: {
        ...oldData?.result,
        subtasks: newList,
      },
    };
  })();

  if (oldData && newData) {
    queryClient.setQueryData(queryKey, newData);
  }

  return { oldData, newData, queryKey };
};

const deleteSubtaskFromList = (
  id: string,
  queryClient: QueryClient,
  parentTaskId?: string | null
) => {
  if (!parentTaskId || !id) return;

  const queryKey = queryKeys.tasks.detail(parentTaskId);

  const oldData = queryClient.getQueryData(
    queryKey
  ) as StandardizeResponse<TaskApp>;

  const newData = (() => {
    if (!oldData?.result?.subtasks?.length) return oldData;

    const newList = oldData?.result?.subtasks?.filter((item) => item.id !== id);

    return {
      ...oldData,
      result: {
        ...oldData?.result,
        subtasks: newList ?? [],
      },
    };
  })();

  if (oldData && newData) {
    queryClient.setQueryData(queryKey, newData);
  }

  return { newData, oldData, queryKey };
};

export const eagerUpdaterTaskDetail = {
  update,
  updateSubtasksList,
  deleteSubtaskFromList,
};
