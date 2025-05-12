import { ProjectInsertType, ProjectType } from "@/src/db/schema/projects";
import {
  createResponse,
  StandardApiResponse,
} from "../../utils/createApiResponse";

export const createNewProject = async (
  values: Omit<ProjectInsertType, "ownerId">
): Promise<StandardApiResponse<ProjectType | null>> => {
  if (!values.name) {
    return createResponse({
      status: 400,
      message: "Missing important parameters, didn't leave the client!",
      userFriendly: false,
    });
  }

  try {
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    return createResponse({
      status: 500,
      message: "Something went wrong please try again",
      userFriendly: true,
    });
  }
};
