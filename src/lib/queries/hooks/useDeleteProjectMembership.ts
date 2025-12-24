import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type {
  V1ProjectMembershipDeleteRequest,
  V1ProjectMembershipDeleteResponse,
} from "@/app/api/v1/project/membership/delete";
import { deleteProjectMembership } from "../mutators/deleteProjectMembership";

export const useDeleteProjectMembership = (
  options?: UseMutationOptions<
    V1ProjectMembershipDeleteResponse,
    Error,
    V1ProjectMembershipDeleteRequest
  >,
) => {
  return useMutation({
    mutationFn: deleteProjectMembership,
    ...options,
  });
};
