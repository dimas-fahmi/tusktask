import { auth } from "@/auth";
import { db } from "@/src/db";
import {
  ConversationMembershipInsertType,
  ConversationMembershipType,
  conversationParticipants,
  conversations,
  ConversationType,
} from "@/src/db/schema/conversations";
import { teams, TeamType } from "@/src/db/schema/teams";
import { users, UserType } from "@/src/db/schema/users";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { CustomError } from "@/src/lib/tusktask/utils/error";
import { TeamWithTeamMembers } from "@/src/types/team";
import { and, eq, or } from "drizzle-orm";

export interface ConversationsPostRequest {
  type: ConversationType["type"];
  teamId?: string;
  directOne?: string;
  directTwo?: string;
  image?: string;
}

export async function conversationsPost(req: Request) {
  // Parse Body
  let body: ConversationsPostRequest;

  try {
    body = await req.json();
  } catch (error) {
    return createNextResponse(400, {
      messages: "Invalid JSON body",
    });
  }

  // Pull Session and Validate
  const session = await auth();

  if (!session?.user?.id) {
    return createNextResponse(401, {
      messages: "Invalid session",
    });
  }

  // Data Prossecing
  try {
    const result = await db.transaction(async (tx) => {
      // 1. Destructure Request
      const { type, teamId, directOne, directTwo, image } = body;

      // 2. Check the operation
      if (!type) {
        throw new CustomError(
          "BAD_REQUEST",
          "Missing important parameters: [type]",
          400
        );
      }

      // 3. Validate Request

      if (type === "direct") {
        if (!directOne || !directTwo) {
          throw new CustomError(
            "BAD_REQUEST",
            "Missing Important Parameters: [directOne | directTwo]",
            400
          );
        }

        // 4. Execution Direct Type

        let usersTarget: UserType[] | undefined;

        try {
          usersTarget = await tx.query.users.findMany({
            where: or(eq(users.id, directOne), eq(users.id, directTwo)),
          });
        } catch (error) {
          throw new CustomError(
            "DATABASE_ERROR",
            "Error when fetching target users",
            500
          );
        }

        if (usersTarget.length < 2) {
          throw new CustomError(
            "BAD_REQUEST",
            "Can't find specified users",
            400
          );
        }

        // 5. Prevent Duplication
        let existedConversations: ConversationType | undefined;
        try {
          existedConversations = await tx.query.conversations.findFirst({
            where: or(
              eq(conversations.id, `${directOne}/${directTwo}`),
              eq(conversations.id, `${directTwo}/${directOne}`)
            ),
          });
        } catch (error) {
          throw new CustomError(
            "DATABASE_ERROR",
            "Failed when checking existed conversation table",
            500
          );
        }

        if (existedConversations) {
          throw new CustomError("BAD_REQUEST", "Resource already exist", 400);
        }

        // 6. Execute Creation [conversation model] [direct]
        let newConversation: ConversationType | undefined;
        try {
          [newConversation] = await tx
            .insert(conversations)
            .values({
              id: `${directOne}/${directTwo}`,
              type: "direct",
            })
            .returning();
        } catch (error) {
          throw new CustomError(
            "DATABASE_ERROR",
            "Failed when creating room chat",
            500
          );
        }

        if (!newConversation) {
          throw new CustomError(
            "DATABASE_ERROR",
            "Unexpected error when creating room chat",
            500
          );
        }

        const { id } = newConversation;

        // 6. Register Membership
        let memberships: ConversationMembershipType[] = [
          directOne,
          directTwo,
        ].map((userId) => ({
          conversationId: id,
          userId,
          role: "owner",
          joinAt: new Date(),
        }));

        try {
          await tx.insert(conversationParticipants).values(memberships);
        } catch (error) {
          throw new CustomError(
            "DATABASE_ERROR",
            "Failed when register conversation membership",
            500
          );
        }

        return newConversation;
      }

      // 4. Execution team type
      if (type === "team") {
        if (!teamId) {
          throw new CustomError(
            "BAD_REQUEST",
            "Missing important parameters: [teamId]",
            400
          );
        }

        // 5. Validate Membership
        let team: (TeamType & TeamWithTeamMembers) | undefined;

        try {
          team = (await tx.query.teams.findFirst({
            where: eq(teams.id, teamId),
            with: {
              teamMembers: true,
            },
          })) as TeamType & TeamWithTeamMembers;
        } catch (error) {
          throw new CustomError(
            "DATABASE_ERROR",
            "Failed when fetching team memberships",
            500
          );
        }

        if (!team) {
          throw new CustomError(
            "BAD_REQUEST",
            "Can't find specified team",
            404
          );
        }
        const { teamMembers, name } = team;

        // 6. Execution creating conversation
        let newConversation: ConversationType | undefined;
        try {
          [newConversation] = await tx
            .insert(conversations)
            .values({ type: "team", image: image ?? null, name })
            .returning();
        } catch (error) {
          throw new CustomError(
            "DATABASE_ERROR",
            "Failed when creating conversation",
            500
          );
        }

        if (!newConversation) {
          throw new CustomError(
            "DATABASE_ERROR",
            "Unexpected error when creating conversation",
            500
          );
        }

        const { id: newConversationId } = newConversation;

        // 7. Execution register memberships
        let memberships: ConversationMembershipInsertType[] = teamMembers.map(
          (tm) => ({
            conversationId: newConversationId,
            userId: tm.userId,
            role: tm.userRole === "owner" ? "owner" : "member",
            joinAt: new Date(),
          })
        );

        try {
          await tx.insert(conversationParticipants).values(memberships);
        } catch (error) {
          throw new CustomError(
            "DATABASE_ERROR",
            "Failed when registering memberships",
            500
          );
        }

        return newConversation;
      }

      throw new CustomError("BAD_REQUEST", "Invalid type", 400);
    });

    return createNextResponse(200, {
      messages: "success",
      data: result,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return createNextResponse(error.statusCode, {
        messages: error.message,
      });
    }

    return createNextResponse(500, {
      messages: "Unexpected error",
    });
  }
}
