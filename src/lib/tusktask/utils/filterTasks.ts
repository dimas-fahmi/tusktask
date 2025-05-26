import { FullTask } from "@/src/types/task";

export type FilterType =
  | "archived"
  | "completed"
  | "todo"
  | "shopping"
  | "task"
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
      result = data;
      break;
    case "archived":
      result = data.filter((t) => t.status === "archived");
      break;
    case "completed":
      result = data.filter((t) => t.status === "completed");
      break;
    case "shopping":
      result = data.filter((t) => t.type === "shopping_list");
      break;
    case "todo":
      result = data.filter((t) => t.status !== "completed");
      break;
    case "task":
      result = data.filter((t) => t.type === "task");
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
