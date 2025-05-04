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

  return data.reduce<TasksCategorizerByDate>((acc, task) => {
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

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(task);

    return acc;
  }, {});
};

export default tasksCategorizerByDate;
