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

  const response = await fetch("/api/users", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ userId, trigger, newValue }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};
