import { FullTask } from "@/src/types/task";
import {
  Archive,
  Briefcase,
  Circle,
  CircleCheckBig,
  ClipboardType,
  FolderTree,
  Library,
  LucideIcon,
  Network,
  ShoppingCart,
} from "lucide-react";

export const filtersOptions = [
  "archived",
  "completed",
  "todo",
  "shopping",
  "task",
  "createdByOptimisticUpdate",
  "process",
  "top_level_task",
  "subtasks",
  "all",
] as const;

export type FilterKey = (typeof filtersOptions)[number];

export interface filterItem {
  icon: LucideIcon;
  label: string;
  filterKey: FilterKey;
}

export const filterItems: filterItem[] = [
  { label: "Show All", filterKey: "all", icon: Library },
  { label: "Top Level Task", filterKey: "top_level_task", icon: Network },
  { label: "Subtasks", filterKey: "subtasks", icon: FolderTree },
  { label: "Archived", filterKey: "archived", icon: Archive },
  { label: "Todo", filterKey: "todo", icon: Circle },
  { label: "Shopping", filterKey: "shopping", icon: ShoppingCart },
  { label: "Task", filterKey: "task", icon: ClipboardType },
  { label: "On Process", filterKey: "process", icon: Briefcase },
  { label: "Completed", filterKey: "completed", icon: CircleCheckBig },
];

export type FilterType = (typeof filtersOptions)[number];

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
    case "process":
      result = data.filter(
        (t) => t?.status === "on_process" && !t.createdByOptimisticUpdate
      );
      break;
    case "task":
      result = data.filter(
        (t) => t.type === "task" && !t.createdByOptimisticUpdate
      );
      break;
    case "top_level_task":
      result = data.filter((t) => !t.parentId && !t.createdByOptimisticUpdate);
      break;
    case "subtasks":
      result = data.filter((t) => t.parentId && !t.createdByOptimisticUpdate);
      break;
    case "createdByOptimisticUpdate":
      result = data.filter((t) => t?.createdByOptimisticUpdate);
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
