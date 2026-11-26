import { useMutation } from "@tanstack/react-query";
import type { CompleteProjectType } from "../db/schema/t-project";
import type { TaskSelectType } from "../db/schema/t-task";
import type { TaskCategoryWithTasks } from "../db/schema/t-taskCategory";
import { etm } from "../i18n/errorTranslation/init";
import { useTRPC } from "../lib/trpc/client/client";
import type { GetTaskDetailProcResult } from "../lib/trpc/router/task/getTaskDetail";
import type { OptimisticUpdateState } from "../types/types";
import { Toaster } from "../utils/clientOnly/triggerToast";
import { useErrorTranslation } from "./useErrorTranslation";
import { useHandleQueryError } from "./useHandleQueryError";

/**
 * Task actions collections.
 *
 * IMPORTANT: Make sure task is exists before actions is called, will throw in development if task is undefined and action is called, will fire "Something went wrong" toast if task is undefined and action is called in production.
 *
 * @example
 *
 * ```
 * const task = useQuery({...config}) // TaskSelectType
 * const {delete} = useTaskActions(task);
 *
 * // Should always check against undefine task, if a button to delete a task exists when the data is not, something is wrong before you reached this point.
 * if(task){
 *  delete().mutate({taskId: task.id})
 * }
 *
 * ```
 *
 *
 * @returns Multiple actions.
 */
export const useTaskActions = ({
  task,
  setIsPending,
}: {
  task?: TaskSelectType;
  setIsPending?: (open: boolean) => void;
}) => {
  const { translate } = useErrorTranslation();
  const trpc = useTRPC();
  const { toast } = useHandleQueryError();

  // Update Task
  const updateMutation = useMutation({
    ...trpc.task.updateTask.mutationOptions(),

    onMutate: (data, ctx) => {
      let ou_taskDetail: OptimisticUpdateState<GetTaskDetailProcResult> = null;

      if (task) {
        const taskDetailQK = trpc.task.getTaskDetail.queryKey({
          taskId: task.id,
        });
        const taskDetailOldData = ctx.client.getQueryData(taskDetailQK);

        if (taskDetailOldData) {
          ctx.client.setQueryData(taskDetailQK, () => {
            return {
              ...taskDetailOldData,
              ...data,
            };
          });
        }

        ou_taskDetail = {
          oldData: taskDetailOldData,
          queryKey: taskDetailQK,
        };
      }

      return {
        ou_taskDetail,
      };
    },

    onError: (err, _var, omr, ctx) => {
      toast("task-update-failed", err, true);

      /**
       * Rollback: taskDetail
       */
      if (omr?.ou_taskDetail) {
        ctx.client.setQueryData(
          omr.ou_taskDetail.queryKey,
          omr.ou_taskDetail.oldData,
        );
      }
    },

    onSuccess: () => {},

    onSettled: (_d, _err, _var, _omr, ctx) => {
      if (task) {
        ctx.client.invalidateQueries({
          queryKey: trpc.task.getTaskDetail.queryKey({
            taskId: task.id,
          }),
        });
      }
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    ...trpc.task.deleteTask.mutationOptions(),
    onMutate: (variables, ctx) => {
      // Optimistic Updates States
      let ou_projectDetail: OptimisticUpdateState<CompleteProjectType> = null;

      if (task) {
        /**
         * projectDetail task deletion optimistic update.
         *
         * Deleting the task from its task collections.
         */
        const projectDetailQK = trpc.project.getProjectDetail.queryKey({
          id: task.projectId,
        });

        ctx.client.cancelQueries({
          queryKey: projectDetailQK,
        });

        const projectOldData = ctx.client.getQueryData(projectDetailQK);

        if (projectOldData) {
          const updateTaskCategories = () => {
            const taskCategories = projectOldData?.taskCategories || [];

            if (task.taskCategoryId) {
              const taskCategory: TaskCategoryWithTasks | undefined =
                taskCategories.find((cat) => cat.id === task.taskCategoryId);

              if (taskCategory) {
                const newTaskCategory: TaskCategoryWithTasks = {
                  ...taskCategory,
                  tasks: taskCategory.tasks.filter(
                    (_task) => _task.id !== variables.taskId,
                  ),
                };

                return [
                  ...taskCategories.filter(
                    (cat) => cat.id !== task.taskCategoryId,
                  ),
                  newTaskCategory,
                ];
              }
            }

            return taskCategories;
          };

          ctx.client.setQueryData(projectDetailQK, () => {
            return {
              ...projectOldData,
              uncategorizedTasks: projectOldData.uncategorizedTasks.filter(
                (_task) => _task.id !== variables.taskId,
              ),
              taskCategories: updateTaskCategories(),
            };
          });
        }

        ou_projectDetail = {
          oldData: projectOldData,
          queryKey: projectDetailQK,
        };

        // ------ END OF projectDetail optimistic update -------
      }

      setIsPending?.(true);

      return {
        ou_projectDetail,
      };
    },

    onError: (err, _var, omr, ctx) => {
      toast("task-deletion-failed", err, true);

      /**
       * Rollback: projectDetail
       */
      if (omr?.ou_projectDetail) {
        ctx.client.setQueryData(
          omr.ou_projectDetail.queryKey,
          omr.ou_projectDetail.oldData,
        );
      }
    },

    onSuccess: (_d, variables, _omr, ctx) => {
      // Delete Task Detail Data
      ctx.client.removeQueries({
        queryKey: trpc.task.getTaskDetail.queryKey({
          taskId: variables.taskId,
        }),
      });
    },

    onSettled: (_d, _e, _v, _omr, ctx) => {
      if (task) {
        ctx.client.invalidateQueries({
          queryKey: trpc.project.getProjectDetail.queryKey({
            id: task.projectId,
          }),
        });
      }

      setIsPending?.(false);
    },
  });

  /**
   * Helper function to either throw error or fire a toast.
   */
  const guard = () => {
    if (!task) {
      const msg = "Task is undefined, but action is called.";
      if (process.env.NODE_ENV === "development") {
        throw new Error(msg);
      } else {
        console.error(msg);
        const toast = new Toaster({
          title: translate(etm.unknown_error.construct()),
          trigger: true,
        });

        return toast;
      }
    }
  };

  return {
    // Delete Action
    delete: () => {
      guard();
      return deleteMutation;
    },

    // Update Action
    update: () => {
      guard();
      return updateMutation;
    },
  };
};
