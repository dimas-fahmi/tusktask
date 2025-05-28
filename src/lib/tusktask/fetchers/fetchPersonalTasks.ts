import { TaskGetRequest, TaskWithSubtasks } from "@/app/api/tasks/get";
import { StandardResponse } from "../utils/createResponse";
import { TaskType } from "@/src/db/schema/tasks";

export const fetchPersonalTasks = async (
  request: TaskGetRequest
): Promise<StandardResponse<TaskType[] | TaskWithSubtasks[] | null>> => {
  const queryString = new URLSearchParams(
    request as Record<any, string>
  ).toString();

  const response = await fetch(`/api/tasks?${queryString}`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  if (request.withSubtasks === "true") {
    return data as StandardResponse<TaskWithSubtasks[]>;
  } else {
    return data as StandardResponse<TaskType[]>;
  }
};
