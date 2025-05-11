import { ProjectType } from "@/src/db/schema/projects";
import {
  createResponse,
  StandardApiResponse,
} from "../utils/createApiResponse";
import {
  ProjectsGetRequest,
  ProjectsGetResponseData,
} from "@/app/api/projects/get";

export const fetchFilteredProjects = async (
  filter?: ProjectsGetRequest
): Promise<StandardApiResponse<ProjectsGetResponseData[]>> => {
  try {
    // Construct Fetch URL
    const queryString = new URLSearchParams(filter as Record<string, string>);
    const url = `/api/projects?${queryString}`;

    // Make the fetch request with credentials
    const response = await fetch(url, { credentials: "include" });

    // Parse response
    const data = await response.json();

    // Check if response is OK
    if (response.ok) {
      return data;
    } else {
      throw data;
    }
  } catch (error) {
    // Handle network or parsing errors
    return createResponse({
      status: 500,
      message: "Something went wrong, please try again",
      userFriendly: false,
    });
  }
};
