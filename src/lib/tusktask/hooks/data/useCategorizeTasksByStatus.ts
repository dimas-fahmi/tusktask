import { useMemo } from "react";
import { SubTasksType, TasksGetApiData } from "@/app/api/tasks/types";

export type UseCategorizeTasksByStatus = TasksGetApiData[] | null;

export interface UseCategorizeTaskByStatusOutput {
  completed: TasksGetApiData[];
  not_started: TasksGetApiData[];
  in_progress: TasksGetApiData[];
  archived: TasksGetApiData[];
}

const useCategorizeTasksByStatus = (
  data: UseCategorizeTasksByStatus
): UseCategorizeTaskByStatusOutput => {
  return useMemo(() => {
    let completed = data?.filter((task) => task.status === "completed") || [];
    let not_started =
      data?.filter((task) => task.status === "not_started") || [];
    let in_progress =
      data?.filter((task) => task.status === "in_progress") || [];
    let archived = data?.filter((task) => task.status === "archived") || [];

    return { completed, not_started, in_progress, archived };
  }, [data]);
};

export default useCategorizeTasksByStatus;
