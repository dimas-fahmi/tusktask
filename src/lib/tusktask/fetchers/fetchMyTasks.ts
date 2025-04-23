import { TasksGetApiRequest, TasksGetApiResponse } from "@/app/api/tasks/types";
import { createResponse } from "../utils/createApiResponse";

export const fetchMyTasks = async (
  filter: TasksGetApiRequest
): Promise<TasksGetApiResponse> => {
  if (!filter.ownerId && !filter.createdById) {
    return createResponse({
      status: 500,
      message: "Missing important parameters, didn't leave the client",
      userFriendly: false,
    });
  }

  try {
    const response = await fetch(`/api/tasks?ownerId=${filter.ownerId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    return createResponse({
      status: 500,
      message: "Unexpedted error, please try again.",
      userFriendly: true,
    });
  }
};
