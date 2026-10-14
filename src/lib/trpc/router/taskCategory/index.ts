import { createTaskCategoryProc } from "./createTaskCategory";
import { getTaskCategoriesProc } from "./getTaskCategories";

export const taskCategoryRoute = {
  getTaskCategories: getTaskCategoriesProc,
  createTaskCategory: createTaskCategoryProc,
} as const;
