"use client";

import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { StandardizeResponse } from "../../utils/createResponse";
import { Project } from "@/src/db/schema/projects";
import { OperationError } from "../../errors";
import { ProjectsPatchRequest } from "@/app/api/projects/patch";
import { eagerUpdaterProjectsDetail } from "../../utils/eagerUpdater/projects/detail";
import { EagerUpdaterResult } from "../../types/eagerUpdate";

export interface UseUpdateProjectContext {
  projectDetail?: EagerUpdaterResult<Project[]>;
}

export const useUpdateProject = <TContext extends UseUpdateProjectContext>(
  mutationKey: string[],
  options?: Omit<
    UseMutationOptions<
      StandardizeResponse<Project>,
      OperationError,
      ProjectsPatchRequest,
      TContext
    >,
    "mutationKey" | "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationKey,
    mutationFn: async (req: ProjectsPatchRequest) => {
      const response = await fetch("/api/projects", {
        method: "PATCH",
        body: JSON.stringify(req),
      });

      const result = await response.json();

      if (!response.ok) {
        throw result;
      }

      return result;
    },

    // Optimistic update
    onMutate: (variables, context) => {
      // Extensions
      const extensions = options?.onMutate?.(variables, context);

      // Optimistics Updates
      return {
        // Default optimistics update here...
        projectDetail: eagerUpdaterProjectsDetail.update(
          variables,
          queryClient
        ),

        // Extensions
        ...(extensions ?? {}),
      } as TContext;
    },
    onError: (error, variables, onMutateResult, context) => {
      options?.onError?.(error, variables, onMutateResult, context);

      if (onMutateResult?.projectDetail) {
        queryClient.setQueryData(
          onMutateResult?.projectDetail?.queryKey,
          onMutateResult?.projectDetail?.oldData
        );
      }
    },
    onSuccess: (data, variables, onMutateResult, context) => {
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onSettled: (data, error, variables, onMutateResult, context) => {
      options?.onSettled?.(data, error, variables, onMutateResult, context);

      if (onMutateResult?.projectDetail?.queryKey) {
        queryClient?.invalidateQueries({
          queryKey: onMutateResult?.projectDetail?.queryKey,
        });
      }
    },
  });
};
