import { createTaskProc } from "./createTask";

export const taskRoute = {
  createTask: createTaskProc,
} as const;
