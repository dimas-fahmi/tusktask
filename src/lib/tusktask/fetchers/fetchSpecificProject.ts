import { SpecificProjectGetData } from "@/app/api/projects/[id]/route";
import {
  createResponse,
  StandardApiResponse,
} from "../utils/createApiResponse";

export const fetchSpecificProject = async (
  id: string
): Promise<StandardApiResponse<SpecificProjectGetData | null>> => {
  if (!id) {
    return createResponse({
      status: 500,
      message: "Missing ID parameters, didn't leave the client!",
      userFriendly: false,
    });
  }

  try {
    const response = await fetch(`/api/projects/${id}`, {
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
      message: "Something went wrong please try again!",
      userFriendly: true,
    });
  }
};
