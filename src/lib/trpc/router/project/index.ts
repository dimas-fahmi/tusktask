import { createProjectProc } from "./createProject";
import { getMyProjectsProc } from "./getProjects";

export const projectRoute = {
  create: createProjectProc,
  get: getMyProjectsProc,
} as const;
