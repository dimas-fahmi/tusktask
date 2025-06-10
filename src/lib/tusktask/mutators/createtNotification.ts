import { NotificationsPostRequest } from "@/app/api/notifications/post";
import createResponse, { StandardResponse } from "../utils/createResponse";
import { NotificationType } from "@/src/db/schema/notifications";

export const createNotification = async (
  req: NotificationsPostRequest
): Promise<StandardResponse<NotificationType>> => {
  if (!req?.receiverId || !req?.type) {
    throw createResponse(500, {
      messages: "Missing important parameters, didn't leave the client",
    });
  }

  try {
    const response = await fetch("/api/notifications", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(req),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};
