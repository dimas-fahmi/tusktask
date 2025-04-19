import {
  TasksGetApiResponse,
  TasksPostApiRequest,
} from "@/app/api/tasks/types";
import { createResponse } from "../../utils/createApiResponse";

export const createNewTask = async (
  newTask: TasksPostApiRequest
): Promise<TasksGetApiResponse> => {
  if (!newTask.name) {
    return createResponse({
      status: 500,
      message: "Missing important parameters, didn't leave the client",
      userFriendly: false,
    });
  }

  try {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newTask),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    return createResponse({
      status: 500,
      message: "Unexpected Error, please try again",
      userFriendly: true,
    });
  }
};
