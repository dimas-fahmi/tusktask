import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AuthProfilePatchResponse } from "@/app/api/auth/profile/patch";
import type { UserType } from "@/src/db/schema/auth-schema";
import { queryIndex } from "..";
import { mutateUserProfile } from "../mutators/mutateUserProfile";

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const { queryKey: profileQueryKey } = queryIndex.self.profile();

  return useMutation({
    mutationFn: mutateUserProfile,
    onMutate: (data) => {
      queryClient.cancelQueries({
        queryKey: profileQueryKey,
      });

      const oldData = queryClient.getQueryData(
        profileQueryKey,
      ) as AuthProfilePatchResponse;

      if (oldData) {
        queryClient.setQueryData(
          profileQueryKey,
          (): AuthProfilePatchResponse => {
            return {
              ...oldData,
              result: {
                ...oldData?.result,
                ...(data as UserType),
              },
            };
          },
        );
      }

      return { oldData };
    },
    onError: (_err, _var, onMutateResult) => {
      if (onMutateResult?.oldData) {
        queryClient.setQueryData(profileQueryKey, onMutateResult.oldData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: profileQueryKey,
      });
    },
  });
};
