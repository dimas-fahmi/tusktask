import { createProjectProc } from "./createProject";
import { deleteMyProjectProc } from "./deleteProject";
import { getProjectDetailProc } from "./getProjectDetail";
import { getMyProjectsProc } from "./getProjects";

export const projectRoute = {
  create: createProjectProc,
  get: getMyProjectsProc,
  delete: deleteMyProjectProc,
  getProjectDetail: getProjectDetailProc,
} as const;
