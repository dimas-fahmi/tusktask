import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type {
  V1ProjectMembershipPatchRequest,
  V1ProjectMembershipPatchResponse,
} from "@/app/api/v1/project/membership/patch";
import { mutateProjectMembership } from "../mutators/mutateProjectMembership";

export const useUpdateMembership = (
  options?: UseMutationOptions<
    V1ProjectMembershipPatchResponse,
    Error,
    V1ProjectMembershipPatchRequest
  >,
) => {
  return useMutation({
    mutationFn: mutateProjectMembership,
    ...options,
  });
};
