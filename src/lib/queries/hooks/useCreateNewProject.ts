import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  V1ProjectPostRequest,
  V1ProjectPostResponse,
} from "@/app/api/v1/project/post";
import type { StandardError } from "../../app/errors";
import { createNewProject } from "../posters/createNewProject";

export interface UseCreateNewProjectProps {
  options?: Omit<
    UseMutationOptions<
      V1ProjectPostResponse,
      StandardError,
      V1ProjectPostRequest
    >,
    "mutationFn"
  >;
}

export const useCreateNewProject = (props?: UseCreateNewProjectProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNewProject,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["self", "projects"],
        exact: false,
      });
    },
    ...(props?.options || {}),
  });
};
