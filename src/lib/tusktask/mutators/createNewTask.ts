import { TasksPostRequest } from "@/app/api/tasks/post";
import { StandardResponse } from "../utils/createResponse";
import { TaskType } from "@/src/db/schema/tasks";

export const createNewTask = async (
  request: TasksPostRequest
): Promise<StandardResponse<TaskType | null>> => {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};
