import { QueryClient, useMutation } from "@tanstack/react-query";
import { mutateTaskData } from "../mutators/mutateTaskData";

export interface UseUpdateTask {
  queryClient: QueryClient;
  teamDetailKey?: string | null;
}

export const useUpdateTask = ({
  queryClient,
  teamDetailKey,
}: UseUpdateTask) => {
  return useMutation({
    mutationFn: mutateTaskData,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["team", teamDetailKey],
      });
    },
  });
};
