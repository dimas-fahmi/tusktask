import { auth } from "@/auth";
import { db } from "@/src/db";
import { notifications } from "@/src/db/schema/notifications";
import { users } from "@/src/db/schema/users";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { NotificationBundle } from "@/src/types/notification";
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
    const received = await db.query.notifications.findMany({
      where: eq(notifications.receiverId, session.user.id),
      with: {
        receiver: true,
        sender: true,
        team: true,
      },
    });

    const sent = await db.query.notifications.findMany({
      where: eq(notifications.senderId, session.user.id),
      with: {
        receiver: true,
        sender: true,
        team: true,
      },
    });

    const result: NotificationBundle = {
      sent,
      received,
    };

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
