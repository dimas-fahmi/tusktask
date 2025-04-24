import { TaskType } from "@/src/db/schema/tasks";
import {
  createResponse,
  StandardApiResponse,
} from "../../utils/createApiResponse";
import { TaskPatchApiRequest } from "@/app/api/tasks/patch";

export const mutateTaskData = async ({
  taskId,
  newValue,
}: TaskPatchApiRequest): Promise<StandardApiResponse<TaskType | null>> => {
  if (!taskId || !newValue) {
    return createResponse({
      status: 500,
      message: "Missing important parameters, didn't leave the client",
      userFriendly: false,
    });
  }

  try {
    const response = await fetch("/api/tasks", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ taskId, newValue }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    return createResponse({
      status: 500,
      message: "Unexpected error, please try again",
      userFriendly: true,
    });
  }
};
