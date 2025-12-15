import type { V1ProjectGetRequest } from "@/app/api/v1/project/get";
import { objectToQueryString } from "../../utils/objectToQueryString";

export async function getProjects(request?: V1ProjectGetRequest) {
  const queryString = objectToQueryString(request);
  const response = await fetch(`/api/v1/project?${queryString}`);
  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}
