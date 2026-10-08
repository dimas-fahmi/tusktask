import { createProjectProc } from "./createProject";
import { deleteMyProjectProc } from "./deleteProject";
import { getProjectDetailProc } from "./getProjectDetail";
import { getMyProjectsProc } from "./getProjects";
import { updateProjectProc } from "./updateProject";

export const projectRoute = {
  create: createProjectProc,
  get: getMyProjectsProc,
  delete: deleteMyProjectProc,
  getProjectDetail: getProjectDetailProc,
  updateProject: updateProjectProc,
} as const;
