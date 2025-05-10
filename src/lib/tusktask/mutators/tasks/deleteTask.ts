import { TaskType } from "@/src/db/schema/tasks";
import {
  createResponse,
  StandardApiResponse,
} from "../../utils/createApiResponse";
import { TaskDeleteRequest } from "@/app/api/tasks/delete";

const deleteTask = async ({
  taskId,
  method,
}: {
  taskId: string;
  method: TaskDeleteRequest["method"];
}): Promise<StandardApiResponse<TaskType | null>> => {
  if (!taskId || !method) {
    return createResponse({
      status: 500,
      message: "Missing important parameters, didn't leave the client",
      userFriendly: false,
    });
  }

  try {
    const response = await fetch(
      `/api/tasks?taskId=${taskId}&method=${method}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    return createResponse({
      status: 500,
      message:
        "Something went wrong, didn't leave the client. Please try again!",
      userFriendly: true,
    });
  }
};

export default deleteTask;
