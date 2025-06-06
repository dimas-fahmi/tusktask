import { NotificationBundle } from "@/src/types/notification";
import { StandardResponse } from "../utils/createResponse";

export const fetchNotifications = async (): Promise<
  StandardResponse<NotificationBundle | null>
> => {
  const response = await fetch("/api/notifications");

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};
