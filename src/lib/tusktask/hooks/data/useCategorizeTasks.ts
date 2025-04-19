import { TasksGetApiData } from "@/app/api/tasks/types";

export interface UseCategorizeTasks {
  overdue: TasksGetApiData[];
  today: TasksGetApiData[];
  tomorrow: TasksGetApiData[];
  todo: TasksGetApiData[];
  completed: TasksGetApiData[];
}

export const useCategorizeTasks = (
  data: TasksGetApiData[] | null
): UseCategorizeTasks => {
  if (!data) {
    return {
      overdue: [],
      today: [],
      tomorrow: [],
      todo: [],
      completed: [],
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);

  const categorized = {
    overdue: [] as TasksGetApiData[],
    today: [] as TasksGetApiData[],
    tomorrow: [] as TasksGetApiData[],
    todo: [] as TasksGetApiData[],
    completed: [] as TasksGetApiData[],
  };

  for (const task of data) {
    const completedAt = task.completedAt ? new Date(task.completedAt) : null;
    if (completedAt) {
      categorized.completed.push(task);
      continue;
    }

    const deadlineOrCreatedAt = new Date(task.deadlineAt ?? task.createdAt);
    deadlineOrCreatedAt.setHours(23, 59, 59, 999); // deadline is end of that day

    if (deadlineOrCreatedAt < today) {
      categorized.overdue.push(task);
    } else if (deadlineOrCreatedAt >= today && deadlineOrCreatedAt < tomorrow) {
      categorized.today.push(task);
    } else if (
      deadlineOrCreatedAt >= tomorrow &&
      deadlineOrCreatedAt < dayAfterTomorrow
    ) {
      categorized.tomorrow.push(task);
    } else {
      categorized.todo.push(task);
    }
  }

  return categorized;
};
