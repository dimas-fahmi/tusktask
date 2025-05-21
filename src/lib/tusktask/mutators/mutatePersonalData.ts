import {
  UsersPersonalPatchRequest,
  UsersPersonalPatchResponse,
} from "@/app/api/users/personal/patch";
import createResponse from "../utils/createResponse";

const mutatePersonalData = async (
  request: UsersPersonalPatchRequest
): Promise<UsersPersonalPatchResponse> => {
  if (!request.operation) {
    return createResponse(500, {
      messages: "Missing important parameters didn't leave the client",
    });
  }

  try {
    const response = await fetch("/api/users/personal", {
      method: "PATCH",
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
  } catch (error) {
    throw error;
  }
};

export default mutatePersonalData;
