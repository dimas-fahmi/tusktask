import type { V1TaskGetRequest } from "@/app/api/v1/task/get";
import { objectToQueryString } from "../../utils/objectToQueryString";

export async function getTasks(req?: V1TaskGetRequest) {
  const queryString = objectToQueryString(req);
  const response = await fetch(`/api/v1/task?${queryString}`);
  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}
