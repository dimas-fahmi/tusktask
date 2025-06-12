import { TasksPatchRequest } from "@/app/api/tasks/patch";
import createResponse, { StandardResponse } from "../utils/createResponse";
import { TaskType } from "@/src/db/schema/tasks";

export const mutateTaskData = async (
  req: TasksPatchRequest
): Promise<StandardResponse<TaskType | null>> => {
  if (!req.teamId || !req.id || !req.operation || !req.newValues) {
    throw createResponse(500, {
      messages: "Missing important parameters, didn't leave the client",
    });
  }

  try {
    const response = await fetch("/api/tasks", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(req),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};
