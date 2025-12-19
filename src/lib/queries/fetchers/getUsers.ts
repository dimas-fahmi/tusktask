import type {
  V1UserGetRequest,
  V1UserGetResponse,
} from "@/app/api/v1/user/get";
import { objectToQueryString } from "../../utils/objectToQueryString";

export async function getUsers(
  req: V1UserGetRequest,
): Promise<V1UserGetResponse> {
  const queryString = objectToQueryString(req);
  const response = await fetch(`/api/v1/user?${queryString}`);
  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}
