import { createTaskProc } from "./createTask";
import { getTasksProc } from "./getTasks";

export const taskRoute = {
  createTask: createTaskProc,
  getTasks: getTasksProc,
} as const;
