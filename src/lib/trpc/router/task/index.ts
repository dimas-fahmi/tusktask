import { createTaskProc } from "./createTask";
import { deleteTaskProc } from "./deleteTask";
import { getTasksProc } from "./getTasks";

export const taskRoute = {
  createTask: createTaskProc,
  getTasks: getTasksProc,
  deleteTask: deleteTaskProc,
} as const;
