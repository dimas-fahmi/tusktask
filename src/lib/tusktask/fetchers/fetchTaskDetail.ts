import { DetailTask } from "@/src/types/task";
import createResponse, { StandardResponse } from "../utils/createResponse";

export const fetchTaskDetail = async ({
  id,
}: {
  id: string;
}): Promise<StandardResponse<DetailTask | null>> => {
  if (!id) {
    throw createResponse(500, {
      messages: "Missing Important Parameters: [ID], didn't leave the client",
    });
  }

  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};
