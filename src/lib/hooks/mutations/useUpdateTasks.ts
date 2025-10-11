import { TasksPatchRequest } from "@/app/api/tasks/patch";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { StandardizeResponse } from "../../utils/createResponse";
import { Task } from "@/src/db/schema/tasks";
import { OperationError } from "../../errors";
import {
  eagerUpdaterTasksProject,
  EagerUpdateTasksProjectResult,
} from "../../utils/eagerUpdater/tasks/project";
import { EagerUpdaterResult } from "../../types/eagerUpdate";
import { eagerUpdaterTaskDetail } from "../../utils/eagerUpdater/tasks/detail";
import { TaskApp } from "../../types/tasks";

export interface UseUpdateTaskDefaultContext {
  euTasksProject?: EagerUpdateTasksProjectResult;
  euTasksDetail?: EagerUpdaterResult<Task>;
  euSubtasksList?: EagerUpdaterResult<TaskApp>;
}

export interface UseUpdateTaskVariables {
  req: TasksPatchRequest;
  old: Task;
}

/**
 *
 * ALL TASK UPDATES MUST USE THIS HOOKS, NO EXCEPTIONS!
 *
 * A custom hook to update a task using React Query's `useMutation`, with support for eager updates,
 * rollback on error, and cache invalidation.
 *
 * @template TContext - The context returned from `onMutate`, extending `UseUpdateTaskDefaultContext`.
 *
 * @param {string[]} mutationKey - Unique key used by React Query to identify this mutation.
 * @param {Omit<UseMutationOptions<StandardizeResponse<Task>, OperationError, UseUpdateTaskVariables, TContext>, "mutationKey" | "mutationFn">} [options]
 * Optional mutation configuration options, excluding `mutationKey` and `mutationFn` which are handled internally.
 *
 * @returns {ReturnType<typeof useMutation>} - Returns the mutation object from `useMutation` containing:
 *  - `mutate` and `mutateAsync` methods to trigger the mutation.
 *  - Status booleans like `isLoading`, `isError`, etc.
 *  - Result data, error, and context values.
 *  - In other words? Anything from useMutation
 *
 * @example
 * ```tsx
 * const { mutate: updateTask } = useUpdateTask(["update-task"], {
 *   onSuccess: (data) => console.log("Updated!", data),
 * });
 *
 * updateTask({
 *   req: { id: "task-1", newValues: {name: "New Name"} },
 *   old: task,
 * });
 * ```
 *
 * @see {@link TasksPatchRequest} - this interface for usage.
 *
 *
 * @remarks
 * This hook handles the following internally:
 * - **Eager Update**: Applies a local update to the React Query cache before the server confirms the change.
 * - **Rollback**: Restores the old state if the mutation fails.
 * - **Cache Invalidation**: Invalidates queries to refetch fresh data after mutation completes.
 *
 * @see {@link eagerUpdaterTasksProject} - For example on how to do an optimistic update
 *
 * @throws {OperationError} If the mutation fails, the error is re-thrown for handling in `onError`.
 */
export const useUpdateTask = <TContext extends UseUpdateTaskDefaultContext>(
  mutationKey: string[],
  options?: Omit<
    UseMutationOptions<
      StandardizeResponse<Task>,
      OperationError,
      UseUpdateTaskVariables,
      TContext | void
    >,
    "mutationKey" | "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...options,

    // Hard-coded mutationKey and mutationFn
    mutationKey,
    mutationFn: async (data: UseUpdateTaskVariables) => {
      const { req } = data;
      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });

      const result = await response.json();

      if (!response.ok) {
        throw result;
      }

      return result;
    },

    // Eager Update
    onMutate: (data, context) => {
      // Chain mutation context
      const extensions = options?.onMutate?.(data, context);

      // mandatory, don't delete!
      queryClient.cancelQueries({
        queryKey: ["tasks"],
        exact: false,
      });

      // Assume anything on the context is nullable!
      return {
        // Update Project tasks list eager update
        euTasksProject: eagerUpdaterTasksProject.update(
          data.req,
          data.old.projectId,
          queryClient
        ),
        euTasksDetail: eagerUpdaterTaskDetail.update(data.req, queryClient),
        euSubtasksList: eagerUpdaterTaskDetail.updateSubtasksList(
          data.req,
          queryClient,
          data?.old?.parentTask
        ),

        // More eager update here...

        // Extensions
        ...(extensions ?? {}),
      } as TContext;
    },
    onError: (error, variables, onMutateResult, context) => {
      // Extending
      options?.onError?.(error, variables, onMutateResult, context);

      // Roll Backs
      if (onMutateResult?.euTasksProject) {
        queryClient.setQueryData(
          onMutateResult?.euTasksProject?.queryKey,
          onMutateResult?.euTasksProject?.oldData
        );
      }

      if (onMutateResult?.euTasksDetail) {
        queryClient.setQueryData(
          onMutateResult?.euTasksDetail?.queryKey,
          onMutateResult?.euTasksDetail?.oldData
        );
      }

      if (onMutateResult?.euSubtasksList) {
        queryClient.setQueryData(
          onMutateResult?.euSubtasksList?.queryKey,
          onMutateResult?.euSubtasksList?.oldData
        );
      }
    },
    onSuccess: (_data, _variables, _onMutateResult, _context) => {
      options?.onSuccess?.(_data, _variables, _onMutateResult, _context);
    },
    onSettled: (data, error, variables, onMutateResult, context) => {
      // Extending
      options?.onSettled?.(data, error, variables, onMutateResult, context);

      // Invalidations
      if (onMutateResult?.euTasksProject) {
        queryClient.invalidateQueries({
          queryKey: onMutateResult?.euTasksProject?.queryKey,
        });
      }

      if (onMutateResult?.euTasksDetail) {
        queryClient.invalidateQueries({
          queryKey: onMutateResult?.euTasksDetail?.queryKey,
        });
      }

      if (onMutateResult?.euSubtasksList) {
        queryClient.invalidateQueries({
          queryKey: onMutateResult?.euSubtasksList?.queryKey,
        });
      }
    },
  });

  return mutation;
};
