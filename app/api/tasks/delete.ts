import { auth } from "@/auth";
import { db } from "@/src/db";
import { tasks, TaskType } from "@/src/db/schema/tasks";
import { teamMembers, TeamMembersType } from "@/src/db/schema/teams";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { and, eq } from "drizzle-orm";

export interface TasksDeleteRequest {
  taskId: string;
  teamId: string;
}

export async function tasksDelete(req: Request) {
  // Parse request body
  let body: TasksDeleteRequest;

  try {
    body = await req.json();
  } catch (error) {
    return createNextResponse(400, {
      messages: "Invalid JSON body",
    });
  }

  // Destructure and validate request body
  const { taskId, teamId } = body;

  if (!taskId || !teamId) {
    return createNextResponse(400, {
      messages: "Missing important parameters",
    });
  }

  // Pull session
  const session = await auth();

  if (!session || !session.user.id) {
    return createNextResponse(401, {
      messages: "Invalid session",
    });
  }

  // Check membership
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
        messages:
          "Membership doesn't exist, you are not part of this team anymore.",
      });
    }
  } catch (error) {
    return createNextResponse(500, {
      messages: "Failed when validating your membership",
    });
  }

  const { userRole } = membership;

  if (!["owner", "admin"].includes(userRole)) {
    return createNextResponse(403, {
      messages: "Only owner and admin can perform this operation",
    });
  }

  //  Check if task is exist
  let task: TaskType | undefined;

  try {
    task = await db.query.tasks.findFirst({
      where: and(eq(tasks.id, taskId), eq(tasks.teamId, teamId)),
    });

    if (!task) {
      return createNextResponse(404, {
        messages: "Can't found targeted task",
      });
    }
  } catch (error) {
    return createNextResponse(500, {
      messages: "Failed when fetching task to delete",
    });
  }

  // Delete task
  try {
    const response = await db
      .delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.teamId, teamId)))
      .returning();

    if (!response) {
      return createNextResponse(500, {
        messages: "Unexpected error when deleting task",
      });
    }

    return createNextResponse(200, {
      messages: "Success",
      data: response,
    });
  } catch (error) {
    return createNextResponse(500, {
      messages: "Failed when executing delete command",
    });
  }
}
