import { useMutation } from "@tanstack/react-query";
import type { CompleteProjectType } from "../db/schema/t-project";
import type { TaskSelectType } from "../db/schema/t-task";
import type { TaskCategoryWithTasks } from "../db/schema/t-taskCategory";
import { etm } from "../i18n/errorTranslation/init";
import { useTRPC } from "../lib/trpc/client/client";
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

  // Delete Mutation
  const deleteMutation = useMutation({
    ...trpc.task.deleteTask.mutationOptions(),
    onMutate: (variables, ctx) => {
      let projectDetail_OU: {
        oldData: CompleteProjectType | undefined;
        queryKey: unknown[];
      } | null = null;

      if (task) {
        /**
         * projectDetail task deletion optimistic update.
         *
         * Deleting the task from its task collections.
         */
        const projectDetailQC = trpc.project.getProjectDetail.queryKey({
          id: task.projectId,
        });

        ctx.client.cancelQueries({
          queryKey: projectDetailQC,
        });

        const oldData = ctx.client.getQueryData(projectDetailQC);

        const updateTaskCategories = () => {
          const taskCategories = oldData?.taskCategories || [];

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

        if (oldData) {
          ctx.client.setQueryData(projectDetailQC, () => {
            return {
              ...oldData,
              uncategorizedTasks: oldData.uncategorizedTasks.filter(
                (_task) => _task.id !== variables.taskId,
              ),
              taskCategories: updateTaskCategories(),
            };
          });
        }

        projectDetail_OU = {
          oldData,
          queryKey: projectDetailQC,
        };
      }

      setIsPending?.(true);

      return {
        projectDetail_OU,
      };
    },

    onError: (err, _var, omr, ctx) => {
      toast("task-deletion-failed", err, true);

      /**
       * Revert changes: projectDetail
       */
      if (omr?.projectDetail_OU) {
        ctx.client.setQueryData(
          omr.projectDetail_OU.queryKey,
          omr.projectDetail_OU.oldData,
        );
      }
    },

    onSuccess: () => {},

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
    delete: () => {
      guard();
      return deleteMutation;
    },
  };
};
