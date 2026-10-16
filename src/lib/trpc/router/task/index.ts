import { createTaskProc } from "./createTask";
import { deleteTaskProc } from "./deleteTask";
import { getTasksProc } from "./getTasks";
import { updateTaskProc } from "./updateTask";

export const taskRoute = {
  createTask: createTaskProc,
  getTasks: getTasksProc,
  deleteTask: deleteTaskProc,
  updateTask: updateTaskProc,
} as const;
