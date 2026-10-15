import { createTaskCategoryProc } from "./createTaskCategory";
import { deleteTaskCategoryProc } from "./deleteTaskCategory";
import { getTaskCategoriesProc } from "./getTaskCategories";

export const taskCategoryRoute = {
  getTaskCategories: getTaskCategoriesProc,
  createTaskCategory: createTaskCategoryProc,
  deleteTaskCategory: deleteTaskCategoryProc,
} as const;
