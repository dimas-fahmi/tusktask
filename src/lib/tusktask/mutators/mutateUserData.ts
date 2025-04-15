import { UsersPatchApiRequest, UsersPatchApiResponse } from "@/src/types/api";
import { createResponse } from "../utils/createApiResponse";

export const mutateUserData = async ({
  userId,
  trigger,
  newValue,
}: UsersPatchApiRequest): Promise<UsersPatchApiResponse> => {
  if (!userId || !trigger || !newValue) {
    return createResponse({
      status: 500,
      message: "impotant parameters is not provided, didn't leave the client",
      userFriendly: false,
      data: null,
    });
  }

  try {
    const response = await fetch("/api/users", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ userId, trigger, newValue }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Standardized response
      throw data;
    }

    // Standardized response
    return data;
  } catch (error) {
    if (error instanceof Error && "status" in error) {
      // This is already a formatted error from our API
      throw error;
    }
    // Handle network errors or other exceptions
    return createResponse({
      status: 500,
      message: `Failed to update user data: ${error instanceof Error ? error.message : "Unknown error"}`,
      userFriendly: false,
      data: null,
    });
  }
};
