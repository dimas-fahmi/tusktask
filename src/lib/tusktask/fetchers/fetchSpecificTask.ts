import { SpecificTask } from "@/app/api/tasks/types";
import {
  createResponse,
  StandardApiResponse,
} from "../utils/createApiResponse";

export const fetchSpecificTask = async (
  id: string
): Promise<StandardApiResponse<SpecificTask | null>> => {
  if (!id) {
    return createResponse({
      status: 500,
      message: "Missing important parameters, didn't leave the client.",
      userFriendly: false,
      data: null,
    });
  }

  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    return createResponse({
      status: 500,
      message: "Something went wrong, please try again",
      userFriendly: false,
      data: null,
    });
  }
};
