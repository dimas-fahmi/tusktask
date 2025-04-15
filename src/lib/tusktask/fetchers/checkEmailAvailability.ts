import { EmailGetApiRequest, EmailGetApiResponse } from "@/src/types/api";
import { createResponse } from "../utils/createApiResponse";

export const checkEmailAvailability = async ({
  userId,
  email,
}: {
  userId: string;
  email: string;
}): Promise<EmailGetApiResponse> => {
  if (!userId || !email) {
    return createResponse({
      status: 500,
      message: "missing important parameters, didn't leave the client",
      userFriendly: false,
      data: null,
    });
  }

  const reason: EmailGetApiRequest["reason"] = "email_availability";

  try {
    const response = await fetch(
      `/api/email?userId=${userId}&email=${email}&reason=${reason}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    );

    const data = (await response.json()) as EmailGetApiResponse;

    if (!response.ok && data.message !== "email_available") {
      throw data;
    }

    return data;
  } catch (error) {
    return createResponse({
      status: 500,
      message: "failed to fetch",
      userFriendly: false,
      data: null,
    });
  }
};
