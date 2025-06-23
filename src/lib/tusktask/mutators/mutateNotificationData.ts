import {
  NotificationsPatchRequest,
  NotificationsPatchResponse,
} from "@/app/api/notifications/patch";
import createResponse from "../utils/createResponse";

export const mutateNotificationData = async (
  req: NotificationsPatchRequest
): Promise<NotificationsPatchResponse> => {
  if (!req.notificationId || !req.newValue) {
    throw createResponse(500, {
      messages: "Missing important parameters",
    });
  }

  try {
    const response = await fetch("/api/notifications", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(req),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    throw createResponse(500, {
      messages: "Something went wrong",
      data: error,
    });
  }
};
