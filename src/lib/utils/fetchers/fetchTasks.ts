import { TasksGetRequest } from "@/app/api/tasks/get";
import { StandardizeResponse } from "../createResponse";
import { objectToQueryString } from "../objectToQueryString";
import { APP_URL } from "../../configs";

export async function fetchTasks<T>(
  req?: TasksGetRequest
): Promise<StandardizeResponse<T>> {
  const queryString = objectToQueryString(req as Record<string, string>);
  const response = await fetch(`${APP_URL}/api/tasks?${queryString}`);
  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}
