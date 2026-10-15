import { createTaskCategoryProc } from "./createTaskCategory";
import { deleteTaskCategoryProc } from "./deleteTaskCategory";
import { getTaskCategoriesProc } from "./getTaskCategories";
import { updateTaskCategoryProc } from "./updateTaskCategory";

export const taskCategoryRoute = {
  getTaskCategories: getTaskCategoriesProc,
  createTaskCategory: createTaskCategoryProc,
  deleteTaskCategory: deleteTaskCategoryProc,
  updateTaskCategory: updateTaskCategoryProc,
} as const;
