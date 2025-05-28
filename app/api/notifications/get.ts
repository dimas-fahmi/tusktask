import { auth } from "@/auth";
import { db } from "@/src/db";
import { notifications } from "@/src/db/schema/notifications";
import { users } from "@/src/db/schema/users";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import {
  FullNotification,
  NotificationWithSender,
  NotificationWithTeam,
} from "@/src/types/notification";
import { eq } from "drizzle-orm";

export async function notificationsGet(req: Request) {
  // Validate session
  const session = await auth();

  if (!session || !session.user.id) {
    return createNextResponse(401, {
      messages: "Invalid session",
    });
  }

  // Fetch
  try {
    const response = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: {},
      with: {
        receivedNotifications: {
          with: {
            sender: {},
            team: {},
          },
        },
      },
    });

    const result: FullNotification[] = response?.receivedNotifications
      ? response.receivedNotifications
      : [];

    return createNextResponse(200, {
      messages: "success",
      data: result,
    });
  } catch (error) {
    return createNextResponse(500, {
      messages: "Failed when fetching notifications",
    });
  }
}
