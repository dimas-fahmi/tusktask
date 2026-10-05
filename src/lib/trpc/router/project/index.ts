import { createProjectProc } from "./createProject";
import { deleteMyProjectProc } from "./deleteProject";
import { getMyProjectsProc } from "./getProjects";

export const projectRoute = {
  create: createProjectProc,
  get: getMyProjectsProc,
  delete: deleteMyProjectProc,
} as const;
