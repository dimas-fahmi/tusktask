import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  V1TaskPostRequest,
  V1TaskPostResponse,
} from "@/app/api/v1/task/post";
import { createNewTask } from "../posters/createNewTask";

export const useCreateNewTask = (
  options?: UseMutationOptions<V1TaskPostResponse, Error, V1TaskPostRequest>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNewTask,
    ...(options || {}),
    onSettled: (data, err, req, onMutateResult, ctx) => {
      options?.onSettled?.(data, err, req, onMutateResult, ctx);
      queryClient.invalidateQueries({
        queryKey: ["self", "tasks"],
        exact: false,
      });
    },
  });
};
