import { createProjectProc } from "./create";
import { getMyProjectsProc } from "./get";

export const projectRoute = {
  create: createProjectProc,
  get: getMyProjectsProc,
} as const;
