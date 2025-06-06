import { auth } from "@/auth";
import { db } from "@/src/db";
import {
  notifications,
  NotificationType,
  notificationUpdateSchema,
} from "@/src/db/schema/notifications";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { StandardResponse } from "@/src/lib/tusktask/utils/createResponse";
import { includeFields } from "@/src/lib/tusktask/utils/includeFields";
import { normalizeDateFields } from "@/src/lib/tusktask/utils/normalizeDateFields";
import { and, eq } from "drizzle-orm";

export interface NotificationsPatchRequest {
  notificationId: string;
  newValue: Partial<NotificationType>;
}

export type NotificationsPatchResponse =
  StandardResponse<NotificationType | null>;

export async function notificationsPatch(req: Request) {
  let body: NotificationsPatchRequest;

  // 1. Parse body
  try {
    body = await req.json();
  } catch (error) {
    return createNextResponse(400, {
      messages: "Invalid JSON body",
    });
  }

  // 2. Validate session
  const session = await auth();

  if (!session?.user?.id) {
    return createNextResponse(401, {
      messages: "Invalid session",
    });
  }

  // 3. Validate notification existance and ownership
  let notification: NotificationType | undefined;

  try {
    notification = await db.query.notifications.findFirst({
      where: and(
        eq(notifications.receiverId, session.user.id),
        eq(notifications.id, body.notificationId)
      ),
    });

    if (!notification) {
      return createNextResponse(404, {
        messages: "Notification not found",
      });
    }
  } catch (error) {
    return createNextResponse(500, {
      messages: "Failed when validating notification",
    });
  }

  // 4. Destructure request
  const { newValue, notificationId } = body;

  // 5. Validate new value [forbidden fields]
  const forbiddenFields: (keyof NotificationType)[] = [
    "createdAt",
    "type",
    "category",
    "senderId",
    "receiverId",
    "teamId",
    "payload",
  ];

  const includedForbiddenFields = includeFields(newValue, forbiddenFields);

  if (includedForbiddenFields.length !== 0) {
    return createNextResponse(400, {
      messages: `${includedForbiddenFields[0]} is forbidden`,
      data: includedForbiddenFields,
    });
  }

  // 6. Validate new value [date and field normalizer]
  const allowedDateFields: (keyof NotificationType)[] = ["markReadAt"];

  let _newValue = normalizeDateFields(
    newValue,
    allowedDateFields
  ) as NotificationType;

  // 7. Validate new value [format]
  const validation = notificationUpdateSchema.safeParse(_newValue);

  if (!validation.success) {
    return createNextResponse(400, {
      messages: "Failed validation phase, bray",
      data: validation.error,
    });
  }

  //   8. update notification
  try {
    const response = await db
      .update(notifications)
      .set(validation.data)
      .where(eq(notifications.id, notificationId))
      .returning();

    if (response.length === 0) {
      return createNextResponse(500, {
        messages: "Unexpected error",
      });
    }

    return createNextResponse(200, {
      messages: "success",
      data: response,
    });
  } catch (error) {
    return createNextResponse(500, {
      messages: "Unexpected error when updating record",
      data: error,
    });
  }
}
