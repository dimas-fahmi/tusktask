import { TasksGetApiData } from "@/app/api/tasks/types";

export interface UseCategorizeTasks {
  overdue: TasksGetApiData[];
  today: TasksGetApiData[];
  tomorrow: TasksGetApiData[];
  upcoming: TasksGetApiData[];
  completed: TasksGetApiData[];
  parents: TasksGetApiData[];
  childrens: TasksGetApiData[];
}

const getStartOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

export const useCategorizeTasks = (
  data: TasksGetApiData[] | null | undefined,
  hideChildren = false
): UseCategorizeTasks => {
  if (!data) {
    return {
      overdue: [],
      today: [],
      tomorrow: [],
      upcoming: [],
      completed: [],
      parents: [],
      childrens: [],
    };
  }

  const today = getStartOfDay(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);

  const categorized = {
    overdue: [] as TasksGetApiData[],
    today: [] as TasksGetApiData[],
    tomorrow: [] as TasksGetApiData[],
    upcoming: [] as TasksGetApiData[],
    completed: [] as TasksGetApiData[],
    parents: [] as TasksGetApiData[],
    childrens: [] as TasksGetApiData[],
  };

  // Populate parents and childrens with all tasks
  categorized.parents = data.filter((task) => task.parentId === null);
  categorized.childrens = data.filter((task) => task.parentId !== null);

  // Apply hideChildren filter only to date-based categories
  const tasksToCategorize = hideChildren
    ? data.filter((task) => task.parentId === null)
    : data;

  for (const task of tasksToCategorize) {
    if (task.completedAt) {
      categorized.completed.push(task);
      continue;
    }

    const relevantDateStr = task.startAt ?? task.deadlineAt ?? task.createdAt!;
    const relevantDate = getStartOfDay(new Date(relevantDateStr));

    if (relevantDate < today) {
      categorized.overdue.push(task);
    } else if (relevantDate >= today && relevantDate < tomorrow) {
      categorized.today.push(task);
    } else if (relevantDate >= tomorrow && relevantDate < dayAfterTomorrow) {
      categorized.tomorrow.push(task);
    } else {
      categorized.upcoming.push(task);
    }
  }

  return categorized;
};
