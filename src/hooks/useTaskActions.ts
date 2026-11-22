import { useMutation } from "@tanstack/react-query";
import type { TaskSelectType } from "../db/schema/t-task";
import { useTRPC } from "../lib/trpc/client/client";
import { useHandleQueryError } from "./useHandleQueryError";

export const useTaskActions = ({
  task,
  setIsPending,
}: {
  task?: TaskSelectType;
  setIsPending?: (open: boolean) => void;
}) => {
  const trpc = useTRPC();
  const { toast } = useHandleQueryError();

  const deleteMutation = useMutation({
    ...trpc.task.deleteTask.mutationOptions(),
    onMutate: () => {
      setIsPending?.(true);
    },

    onError: (err) => {
      toast("task-deletion-failed", err, true);
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

  return {
    deleteMutation,
  };
};
