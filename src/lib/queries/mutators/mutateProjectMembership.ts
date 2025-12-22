import type {
  V1ProjectMembershipPatchRequest,
  V1ProjectMembershipPatchResponse,
} from "@/app/api/v1/project/membership/patch";

export async function mutateProjectMembership(
  req: V1ProjectMembershipPatchRequest,
): Promise<V1ProjectMembershipPatchResponse> {
  const response = await fetch("/api/v1/project/membership", {
    method: "PATCH",
    body: JSON.stringify(req),
  });
  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}
