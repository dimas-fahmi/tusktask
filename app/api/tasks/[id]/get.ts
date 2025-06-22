import { auth } from "@/auth";
import { db } from "@/src/db";
import { tasks } from "@/src/db/schema/tasks";
import { teamMembers, TeamMembersType } from "@/src/db/schema/teams";
import { constructDetailTaskQuery } from "@/src/lib/tusktask/queries/detailTask";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { CustomError } from "@/src/lib/tusktask/utils/error";
import { DetailTask } from "@/src/types/task";
import { Query } from "@tanstack/react-query";
import { and, eq } from "drizzle-orm";

export async function taskGet(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Validate Request
  const { id: taskId } = await params;

  if (!taskId) {
    return createNextResponse(400, {
      messages: "Missing Important Parameters: [ID]",
    });
  }

  // Validate Session
  const session = await auth();

  if (!session?.user?.id) {
    return createNextResponse(401, {
      messages: "Invalid Session",
    });
  }

  try {
    const result = await db.transaction(async (tx) => {
      // Construct Generic Error
      const databaseError = new CustomError(
        "Database Error",
        "Failed When Fetching Task",
        500
      );

      // 1. Fetch Task
      let task: DetailTask | undefined;

      try {
        const query = constructDetailTaskQuery(taskId);
        task = (await tx.query.tasks.findFirst(query)) as DetailTask;
      } catch (error) {
        throw databaseError;
      }

      if (!task) {
        throw new CustomError("Not Found", "Record's Not Found", 404);
      }

      const { teamId } = task;

      // 2. Fetch Membership
      let membership: TeamMembersType | undefined;

      try {
        membership = await tx.query.teamMembers.findFirst({
          where: and(
            eq(teamMembers.teamId, teamId),
            eq(teamMembers.userId, session.user.id)
          ),
        });
      } catch (error) {
        throw databaseError;
      }

      if (!membership) {
        throw new CustomError(
          "Forbidden",
          "Unauthorized Access, Membership Not Found",
          403
        );
      }

      return task;
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
      messages: "Unexpected Error",
    });
  }
}
