import { TasksDeleteRequest } from "@/app/api/tasks/delete";
import createResponse, { StandardResponse } from "../utils/createResponse";
import { TaskType } from "@/src/db/schema/tasks";

export const deleteTask = async (
  req: TasksDeleteRequest
): Promise<StandardResponse<TaskType | null>> => {
  if (!req.taskId || !req.teamId) {
    return createResponse(500, {
      messages: "Missing important parameters, didn't leave the client",
    });
  }

  const response = await fetch("/api/tasks", {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(req),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};
