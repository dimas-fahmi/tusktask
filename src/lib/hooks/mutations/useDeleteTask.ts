import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eagerUpdaterTasksProject } from "../../utils/eagerUpdater/tasks/project";
import { eagerUpdaterTaskDetail } from "../../utils/eagerUpdater/tasks/detail";

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (req: {
      id: string;
      projectId: string;
      parentTaskId?: string | null;
    }) => {
      const { id } = req;
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw result;
      }

      return result;
    },
    onMutate: (data) => {
      return {
        tasksProject: eagerUpdaterTasksProject.del(
          data?.id,
          data?.projectId,
          queryClient
        ),
        deleteSubtasksFromList: eagerUpdaterTaskDetail.deleteSubtaskFromList(
          data?.id,
          queryClient,
          data?.parentTaskId
        ),
      };
    },
    onError: (_err, _var, onMutateResult) => {
      console.log(_err);
      if (onMutateResult?.tasksProject?.oldData) {
        queryClient.setQueryData(
          onMutateResult?.tasksProject?.queryKey,
          onMutateResult?.tasksProject?.oldData
        );
      }

      if (onMutateResult?.deleteSubtasksFromList?.oldData) {
        queryClient.setQueryData(
          onMutateResult?.deleteSubtasksFromList?.queryKey,
          onMutateResult?.deleteSubtasksFromList?.oldData
        );
      }
    },
    onSuccess: (_data, _variables, onMutateResult) => {
      if (onMutateResult?.tasksProject?.queryKey) {
        queryClient.invalidateQueries({
          queryKey: onMutateResult?.tasksProject?.queryKey,
        });
      }

      if (onMutateResult?.deleteSubtasksFromList?.queryKey) {
        queryClient.invalidateQueries({
          queryKey: onMutateResult?.deleteSubtasksFromList?.queryKey,
        });
      }
    },
  });

  return mutation;
};
