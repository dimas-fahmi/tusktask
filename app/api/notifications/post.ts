import { auth } from "@/auth";
import { db } from "@/src/db";
import {
  NotificationInsertType,
  notifications,
  notificationSchema,
  NotificationType,
} from "@/src/db/schema/notifications";
import { teamMembers, TeamMembersType } from "@/src/db/schema/teams";
import { users, UserType } from "@/src/db/schema/users";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { and, eq } from "drizzle-orm";

export interface NotificationsPostRequest extends NotificationInsertType {}

export async function notificationsPost(req: Request) {
  //   Parse body
  let body: NotificationsPostRequest;

  try {
    body = await req.json();
  } catch (error) {
    return createNextResponse(400, {
      messages: "Invalid JSON body",
    });
  }

  // Pull session and validate
  const session = await auth();

  if (!session || !session.user.id) {
    return createNextResponse(401, {
      messages: "Invalid session",
    });
  }

  //  Validation
  const validation = notificationSchema.safeParse(body);

  if (!validation.success) {
    return createNextResponse(400, {
      messages: "Failed to pass validation phase",
      data: validation.error,
    });
  }

  // Validated data
  const validatedData = validation.data;

  // Validation Team Membership
  const insensitiveTypes: NotificationType["type"][] = [
    "directMessage",
    "system",
  ];

  // Check membership
  let membership: TeamMembersType | undefined;

  if (!insensitiveTypes.includes(validatedData.type)) {
    if (!validatedData.teamId) {
      return createNextResponse(400, {
        messages: "Missing important paramete: teamId",
      });
    }

    try {
      membership = await db.query.teamMembers.findFirst({
        where: and(
          eq(teamMembers.teamId, validatedData.teamId),
          eq(teamMembers.userId, session.user.id)
        ),
      });

      if (!membership) {
        return createNextResponse(403, {
          messages: "Membership is not found",
        });
      }
    } catch (error) {
      return createNextResponse(500, {
        messages: "Failed when checking user's team membership",
      });
    }

    // Only owner can transfer ownership
    if (
      membership.userRole !== "owner" &&
      validatedData.type === "transferOwnership"
    ) {
      return createNextResponse(403, {
        messages: "Only owner can do this operation",
      });
    }

    // Admin-owner action restriction
    const adminActions: NotificationType["type"][] = [
      "assignNotification",
      "teamInvitation",
    ];

    if (
      adminActions.includes(validatedData.type) &&
      !["owner", "admin"].includes(membership.userRole)
    ) {
      return createNextResponse(403, {
        messages: "Only administrator can do this operation",
      });
    }
  }

  // Validate the sender is the user
  if (validatedData.senderId !== session.user.id) {
    return createNextResponse(403, {
      messages: "Mismatch security check",
    });
  }

  // Validate the receiver exist
  let receiver: UserType | undefined;

  try {
    receiver = await db.query.users.findFirst({
      where: eq(users.id, validatedData.receiverId),
    });

    if (!receiver) {
      return createNextResponse(404, {
        messages: "Receiver is not found",
      });
    }
  } catch (error) {
    return createNextResponse(500, {
      messages: "Failed when validating receiver account",
    });
  }

  //   Create notification
  try {
    const response = await db
      .insert(notifications)
      .values(validatedData)
      .returning();

    return createNextResponse(200, {
      messages: "success",
      data: response,
    });
  } catch (error) {
    console.log(error);
    return createNextResponse(500, {
      messages: "Failed when creating new notification",
    });
  }
}
