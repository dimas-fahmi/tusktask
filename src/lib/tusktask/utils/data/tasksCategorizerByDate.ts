import { TasksGetApiData } from "@/app/api/tasks/types";

export type TasksCategorizerByDate = Record<string, TasksGetApiData[]>;
export type CategorizeBy = "creation" | "start" | "completed" | "deadline";

const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // "YYYY-MM-DD"
};

const tasksCategorizerByDate = (
  data: TasksGetApiData[] | null,
  categorizeBy: CategorizeBy
): TasksCategorizerByDate => {
  if (!data) return {};

  const grouped: TasksCategorizerByDate = {};

  for (const task of data) {
    let targetDate: string | Date | null | undefined;

    switch (categorizeBy) {
      case "creation":
        targetDate = task.createdAt;
        break;
      case "start":
        targetDate = task.startAt;
        break;
      case "completed":
        targetDate = task.completedAt;
        break;
      case "deadline":
        targetDate = task.deadlineAt;
        break;
    }

    const dateKey = targetDate ? formatDate(targetDate) : "Not Set";

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(task);
  }

  // Sort the keys: latest date first, then "Not Set" at the end
  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    if (a === "Not Set") return 1;
    if (b === "Not Set") return -1;
    return new Date(b).getTime() - new Date(a).getTime(); // descending
  });

  const sortedResult: TasksCategorizerByDate = {};
  for (const key of sortedKeys) {
    sortedResult[key] = grouped[key];
  }

  return sortedResult;
};

export default tasksCategorizerByDate;
