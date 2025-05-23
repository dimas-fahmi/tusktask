import { auth } from "@/auth";
import { db } from "@/src/db";
import { tasks, TaskType } from "@/src/db/schema/tasks";
import { teamMembers, TeamType } from "@/src/db/schema/teams";
import createNextResponse from "@/src/lib/tusktask/utils/createNextResponse";
import { StandardResponse } from "@/src/lib/tusktask/utils/createResponse";
import { extractFieldValues } from "@/src/lib/tusktask/utils/extractFieldValues";
import { getSearchParams } from "@/src/lib/tusktask/utils/getSearchParams";
import { and, eq, gte, ilike, inArray, isNull, or, param } from "drizzle-orm";

export interface TaskGetRequest {
  search?: string;
  creator?: string;
  owner?: string;
  status?: TaskType["status"];
  completedBy?: TaskType["completedAt"];
  claimedBy?: TaskType["claimedById"];
  withSubtasks?: string;
  overdue?: string;
  onlyTopLevel?: string;
  team?: string;
  limit?: string;
  offset?: string;
}

export interface SubtaskType extends TaskType {
  subtasks: TaskType[];
}

export interface TaskWithSubtasks extends TaskType {
  subtasks: SubtaskType[];
  team: TeamType;
}

export async function tasksGet(req: Request) {
  // parameters construction
  const url = new URL(req.url);
  const params = getSearchParams(url, [
    "search",
    "creator",
    "owner",
    "team",
    "status",
    "completedBy",
    "claimedBy",
    "withSubtasks",
    "overdue",
    "limit",
    "offset",
    "onlyTopLevel",
  ]);

  // Pull and Validate session
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return createNextResponse(401, {
      messages: "Invalid session",
      userFriendly: false,
    });
  }

  // Query construction
  let where = [];

  // Search by TaskName & Description
  if (params?.search) {
    where.push(
      or(
        ilike(tasks.name, `%${params.search}%`),
        ilike(tasks.description, `%${tasks.description}%`)
      )
    );
  }

  // Filter by creator
  if (params?.creator) {
    where.push(eq(tasks.id, params.creator));
  }

  //  Filter by owner
  if (params?.owner) {
    where.push(eq(tasks.ownerId, params?.owner));
  }

  // Filter by status
  const allowed_status: TaskType["status"][] = [
    "archived",
    "completed",
    "not_started",
    "on_process",
  ];
  if (params?.status) {
    if (!allowed_status.includes(params.status as TaskType["status"])) {
      return createNextResponse(400, {
        messages: "invalid status",
      });
    }

    where.push(eq(tasks.status, params.status as TaskType["status"]));
  }

  // Filter By Finisher
  if (params?.completedBy) {
    where.push(eq(tasks.completedById, params.completedBy));
  }

  // Filter By Claimer
  if (params?.claimedBy) {
    where.push(eq(tasks.claimedById, params.claimedBy));
  }

  // Filter overdue tasks
  if (params?.overdue === "true") {
    where.push(gte(tasks.deadlineAt, new Date()));
  }

  // Filter Top level task only
  if (params?.onlyTopLevel === "true") {
    where.push(isNull(tasks.parentId));
  }

  // Default Limits and Offset
  let limit: number = 100;
  let offset: number = 0;

  if (params?.limit) {
    const parsedLimit = parseInt(params.limit);
    if (isNaN(parsedLimit)) {
      return createNextResponse(400, {
        messages: "Invalid limit configuration",
      });
    }

    limit = parsedLimit;
  }

  if (params?.offset) {
    const parsedOffset = parseInt(params.offset);
    if (isNaN(parsedOffset)) {
      return createNextResponse(400, {
        messages: "Invalid offset configuration",
      });
    }

    offset = parsedOffset;
  }

  // Get User's teams
  let teams;

  try {
    teams = await db.query.teamMembers.findMany({
      where: eq(teamMembers.userId, session.user.id),
    });

    if (teams.length === 0) {
      return createNextResponse(500, {
        messages: "Fatal Error, please contact developer",
        userFriendly: true,
      });
    }
  } catch (error) {
    return createNextResponse(500, {
      messages: "Failed when fetching your teams, please try again.",
      userFriendly: true,
    });
  }

  // Get user teams' IDs
  const teamIds = extractFieldValues(teams, "teamId");

  where.push(inArray(teamMembers.teamId, teamIds));

  // With mechanism
  let withRelations: any = {};

  // Always return with team
  withRelations.team = {};

  // Dynamic return with subtasks relations
  if (params?.withSubtasks === "true") {
    withRelations.subtasks = {
      with: {
        subtasks: {
          with: {
            subtasks: {},
          },
        },
      },
    };
  }

  //  Fetching
  try {
    const results = await db.query.tasks.findMany({
      where: and(...where),
      with: withRelations,
      limit,
      offset,
    });

    return createNextResponse(results.length === 0 ? 404 : 200, {
      messages:
        results.length === 0
          ? "Fetched but nothing is found"
          : "Fetched and found your tasks",
      userFriendly: true,
      data: results,
    });
  } catch (error) {
    return createNextResponse(500, {
      messages:
        "Something went wrong when fetching your task, please try again!",
      userFriendly: true,
      data: error,
    });
  }
}
