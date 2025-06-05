import { NotificationsPostRequest } from "@/app/api/notifications/post";
import createResponse, { StandardResponse } from "../utils/createResponse";
import { NotificationType } from "@/src/db/schema/notifications";

export interface CreateTeamInvitation {
  receiverId: string;
  senderId: string;
  teamId: string;
}

export async function createTeamInvitation({
  receiverId,
  senderId,
  teamId,
}: CreateTeamInvitation): Promise<StandardResponse<NotificationType | null>> {
  if (!receiverId || !teamId || !senderId) {
    throw createResponse(500, {
      messages: "Missing important parameters",
    });
  }

  const request: NotificationsPostRequest = {
    receiverId: receiverId,
    senderId: senderId,
    category: "teams",
    type: "teamInvitation",
    teamId: teamId,
  };

  const response = await fetch("/api/notifications", {
    method: "POST",
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
}
