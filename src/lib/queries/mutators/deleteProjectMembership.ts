import type {
  V1ProjectMembershipDeleteRequest,
  V1ProjectMembershipDeleteResponse,
} from "@/app/api/v1/project/membership/delete";
import { objectToQueryString } from "../../utils/objectToQueryString";

export async function deleteProjectMembership(
  req: V1ProjectMembershipDeleteRequest,
): Promise<V1ProjectMembershipDeleteResponse> {
  const queryString = objectToQueryString(req);
  const response = await fetch(`/api/v1/project/membership?${queryString}`, {
    method: "DELETE",
  });
  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}
