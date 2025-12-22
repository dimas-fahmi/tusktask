import type {
  V1ProjectMembershipGetRequest,
  V1ProjectMembershipGetResponse,
} from "@/app/api/v1/project/membership/get";
import { objectToQueryString } from "../../utils/objectToQueryString";

export async function getProjectMemberships(
  req: V1ProjectMembershipGetRequest,
): Promise<V1ProjectMembershipGetResponse> {
  const queryString = objectToQueryString(req);
  const response = await fetch(`/api/v1/project/membership?${queryString}`);
  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}
