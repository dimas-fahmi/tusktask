import { FullTask } from "@/src/types/task";

export type FilterType =
  | "archived"
  | "completed"
  | "todo"
  | "shopping"
  | "task"
  | "createdByOptimisticUpdate"
  | "process"
  | "all";

export const filterTasks = (
  data: FullTask[],
  filter: FilterType,
  field?: keyof FullTask,
  order: "asc" | "desc" = "asc"
): FullTask[] => {
  if (!data) {
    return [];
  }

  let result: FullTask[];

  switch (filter) {
    case "all":
      result = data.filter((t) => !t?.createdByOptimisticUpdate);
      break;
    case "archived":
      result = data.filter(
        (t) => t.status === "archived" && !t.createdByOptimisticUpdate
      );
      break;
    case "completed":
      result = data.filter(
        (t) => t.status === "completed" && !t.createdByOptimisticUpdate
      );
      break;
    case "shopping":
      result = data.filter(
        (t) => t.type === "shopping_list" && !t.createdByOptimisticUpdate
      );
      break;
    case "todo":
      result = data.filter(
        (t) => t.status === "not_started" && !t.createdByOptimisticUpdate
      );
      break;
    case "task":
      result = data.filter(
        (t) => t.type === "task" && !t.createdByOptimisticUpdate
      );
      break;
    case "createdByOptimisticUpdate":
      result = data.filter((t) => t?.createdByOptimisticUpdate);
      break;
    case "process":
      result = data.filter((t) => t?.status === "on_process");
      break;
    default:
      result = data;
      break;
  }

  // Sort if field is provided
  if (field) {
    result.sort((a, b) => {
      const valA = a[field];
      const valB = b[field];

      if (valA === undefined || valB === undefined) return 0;

      if (typeof valA === "string" && typeof valB === "string") {
        return order === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return order === "asc" ? valA - valB : valB - valA;
      }

      if (valA instanceof Date && valB instanceof Date) {
        return order === "asc"
          ? valA.getTime() - valB.getTime()
          : valB.getTime() - valA.getTime();
      }

      return 0; // Default fallback for unsupported types
    });
  }

  return result;
};
