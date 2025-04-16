import { UsernameGetApiRequest, UsernameGetApiResponse } from "@/src/types/api";
import { createResponse } from "../utils/createApiResponse";

export const checkUserNameAvailability = async ({
  reason = "username_availability",
  userId,
  userName,
}: UsernameGetApiRequest): Promise<UsernameGetApiResponse> => {
  if (!userId || !userName) {
    return createResponse({
      status: 500,
      message: "missing important parameters, didn't leave the client.",
      userFriendly: false,
      data: null,
    });
  }

  try {
    const response = await fetch(
      `/api/username?userId=${userId}&username=${userName}&reason=${reason}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw data;
    } else {
      return data;
    }
  } catch (error) {
    return createResponse({
      status: 500,
      message: "unexpected error",
      userFriendly: false,
      data: null,
    });
  }
};
