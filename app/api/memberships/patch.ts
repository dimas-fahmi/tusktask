import { auth } from "@/auth";
import { db } from "@/src/db";
import {
  teamMembers,
  TeamMembersType,
  teamMembersUpdateSchema,
} from "@/src/db/schema/teams";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { StandardResponse } from "@/src/lib/tusktask/utils/createResponse";
import { includeFields } from "@/src/lib/tusktask/utils/includeFields";
import { and, eq } from "drizzle-orm";

export interface TeamMembersPatchRequest {
  userId: string;
  teamId: string;
  newValue: Partial<TeamMembersType>;
}

export type TeamMembersPatchResponse = StandardResponse<TeamMembersType | null>;

export async function teamMembersPatch(req: Request) {
  let body: TeamMembersPatchRequest;

  try {
    body = await req.json();
  } catch (error) {
    return createNextResponse(400, {
      messages: "Invalid JSON body",
    });
  }

  // 1. Validate request body
  const { newValue, teamId, userId } = body;

  if (!newValue || !teamId || !userId) {
    return createNextResponse(400, {
      messages: "Missing important parameters",
    });
  }

  // 2. Validate session
  const session = await auth();

  if (!session?.user?.id) {
    return createNextResponse(401, {
      messages: "Invalid session",
    });
  }

  // 3. Validate user membership
  let membership: TeamMembersType | undefined;

  try {
    membership = await db.query.teamMembers.findFirst({
      where: and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, session.user.id)
      ),
    });

    if (!membership) {
      return createNextResponse(403, {
        messages: "Unauthorized access",
      });
    }
  } catch (error) {
    return createNextResponse(500, {
      messages: "Something went wrong when validating membership",
    });
  }

  const { userRole: currentUserRole } = membership;

  //   4. Validate target membership
  let targetMembership: TeamMembersType | undefined;

  try {
    targetMembership = await db.query.teamMembers.findFirst({
      where: and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, userId)
      ),
    });

    if (!targetMembership) {
      return createNextResponse(403, {
        messages: "Unauthorized access",
      });
    }
  } catch (error) {
    return createNextResponse(500, {
      messages: "Something went wrong when validating membership",
    });
  }

  // 5. Validating current user's role
  if (!["owner", "admin"].includes(currentUserRole)) {
    return createNextResponse(403, {
      messages: "Insufficient access",
    });
  }

  //  6. Check if the operation is team ownership transfer
  if (newValue?.userRole && newValue.userRole === "owner") {
    if (currentUserRole !== "owner") {
      return createNextResponse(403, {
        messages: "Forbidden action, only owner can transfer team ownership",
      });
    }
  }

  //   7. Forbidden fields check
  const forbiddenFields: (keyof TeamMembersType)[] = [
    "joinAt",
    "teamId",
    "userId",
  ];

  const includedForbiddenFields = includeFields(newValue, forbiddenFields);

  if (includedForbiddenFields.length !== 0) {
    return createNextResponse(403, {
      messages: `${includedForbiddenFields[0]} is forbidden`,
    });
  }

  // 8. Validate new Value
  const validation = teamMembersUpdateSchema.safeParse(newValue);

  if (!validation.success) {
    return createNextResponse(400, {
      messages: "Failed validation phase",
      data: validation.error,
    });
  }

  // 9. Execute update
  try {
    const response = await db
      .update(teamMembers)
      .set(validation.data)
      .where(
        and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId))
      )
      .returning();

    if (response.length === 0) {
      return createNextResponse(500, {
        messages: "Unexpected error when updating membership",
      });
    }

    return createNextResponse(200, {
      messages: "success",
      data: response,
    });
  } catch (error) {
    return createNextResponse(500, {
      messages: "Failed when updating membership",
    });
  }
}
