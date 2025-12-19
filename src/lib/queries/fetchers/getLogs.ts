import type { V1NotificationLogGetRequest } from "@/app/api/v1/notification/log/get";
import { objectToQueryString } from "../../utils/objectToQueryString";
export async function getLogs(request: V1NotificationLogGetRequest) {
  const queryString = objectToQueryString(request);
  const response = await fetch(`/api/v1/notification/log?${queryString}`);
  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}
