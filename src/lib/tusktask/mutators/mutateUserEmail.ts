import { EmailPatchApiResponse, EmailPatchRequest } from "@/src/types/api";
import { createResponse } from "../utils/createApiResponse";

export const mutateUserEmail = async ({
  userId,
  email,
}: EmailPatchRequest): Promise<EmailPatchApiResponse> => {
  if (!userId || !email) {
    return createResponse({
      status: 500,
      message: "missing important parameters, didn't leave client.",
      userFriendly: false,
      data: null,
    });
  }

  try {
    const response = await fetch("/api/email", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ userId, email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    return createResponse({
      status: 500,
      message: "something went wrong, please try again",
      userFriendly: true,
      data: null,
    });
  }
};
