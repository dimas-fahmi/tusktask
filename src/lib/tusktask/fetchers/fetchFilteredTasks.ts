import { TasksGetApiRequest, TasksGetApiResponse } from "@/app/api/tasks/types";
import { createResponse } from "../utils/createApiResponse";

export const fetchFilteredTasks = async (
  filter: TasksGetApiRequest
): Promise<TasksGetApiResponse> => {
  if (!filter.ownerId || !filter.createdById) {
    return createResponse({
      status: 500,
      message: "Missing important parameters",
      userFriendly: false,
    });
  }

  try {
    const queryString = new URLSearchParams(
      filter as Record<string, string>
    ).toString();
    const response = await fetch(`/api/tasks?${queryString}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);

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
