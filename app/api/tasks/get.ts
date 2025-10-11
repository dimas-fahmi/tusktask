import { db } from "@/src/db";
import { PRIORITIES, STATUSES } from "@/src/db/schema/configs";
import { tasks, TasksRelations } from "@/src/db/schema/tasks";
import { createServerClient } from "@/src/lib/supabase/instances/server";
import { createResponse } from "@/src/lib/utils/createResponse";
import { and, eq, ilike } from "drizzle-orm";
import { NextRequest } from "next/server";

const PATH = "API_TASKS_GET";

export interface TasksGetRequest {
  id?: string;
  name?: string;
  projectId?: string;
  parentTask?: string;
  taskStatus?: string;
  taskPriority?: string;
  createdAt?: Date;
  completedAt?: Date;
  reminderAt?: Date;
  readlineAt?: Date;
  include?: string;
}

export async function tasksGet(req: NextRequest) {
  // Validate Session
  const supabase = await createServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) {
    return createResponse(
      401,
      "unauthorized",
      "Invalid session, login required",
      undefined
    );
  }

  // Extract query parameters
  const url = req.nextUrl;
  const { id, name, projectId, parentTask, taskPriority, taskStatus, include } =
    Object.fromEntries(url.searchParams.entries()) as TasksGetRequest;

  // If ID is provided
  if (id) {
    try {
      const response = await db.query.tasks.findFirst({
        where: and(eq(tasks.id, id), eq(tasks.ownerId, user.id)),
        with: {
          masterTask: true,
          parent: true,
          project: true,
          owner: true,
          subtasks: {
            with: {
              subtasks: true,
            },
          },
        },
      });

      return createResponse(
        response ? 200 : 404,
        response ? "sucess_fetched" : "not_found",
        response ? "Found and fetched" : "No such task",
        response
      );
    } catch (error) {
      return createResponse(
        500,
        "unknown_error",
        "Unknown error",
        undefined,
        true,
        `${PATH}:${JSON.stringify(error)}`
      );
    }
  }

  // Build query
  const query = [];

  // Always fetch by ownership
  query.push(eq(tasks.ownerId, user.id));

  if (name) {
    query.push(ilike(tasks.name, `%${name}%`));
  }

  if (projectId) {
    query.push(eq(tasks.projectId, projectId));
  }

  if (taskPriority) {
    if (PRIORITIES.includes(taskPriority as (typeof PRIORITIES)[number])) {
      query.push(
        eq(tasks.taskPriority, taskPriority as (typeof PRIORITIES)[number])
      );
    } else {
      return createResponse(
        400,
        "bad_request",
        `Invalid taskPriority: either ${PRIORITIES.join(",")}`,
        undefined
      );
    }
  }

  if (taskStatus) {
    if (STATUSES.includes(taskStatus as (typeof STATUSES)[number])) {
      query.push(eq(tasks.taskStatus, taskStatus as (typeof STATUSES)[number]));
    } else {
      return createResponse(
        400,
        "bad_request",
        `Invalid taskStatus: either ${STATUSES.join(",")}`,
        undefined
      );
    }
  }

  if (parentTask) {
    query.push(eq(tasks.parentTask, parentTask));
  }

  // Relations
  const includeQueries = include ? include?.split(",") : [];
  const withRelation: TasksRelations["table"] = {};

  if (includeQueries.includes("owner")) {
    withRelation.owner = true;
  }

  if (includeQueries.includes("parent")) {
    withRelation.parent = true;
  }

  if (includeQueries.includes("subtasks")) {
    withRelation.subtasks = true;
  }

  if (includeQueries.includes("subtasks.subtasks")) {
    withRelation.subtasks = {
      with: {
        subtasks: true,
      },
    };
  }

  if (includeQueries.includes("project")) {
    withRelation.project = true;
  }

  if (includeQueries.includes("masterTask")) {
    withRelation.masterTask = true;
  }

  if (includeQueries.includes("project")) {
    withRelation.project = true;
  }

  // Execute
  try {
    const response = await db.query.tasks.findMany({
      where: and(...query),
      with: {
        ...withRelation,
      },
    });

    const isFound = response?.length > 0;

    return createResponse(
      isFound ? 200 : 404,
      isFound ? "sucess_fetched" : "not_found",
      isFound ? "Found and fetched" : "No such task",
      response
    );
  } catch (error) {
    return createResponse(
      500,
      "unknown_error",
      "Unknown error",
      undefined,
      true,
      `${PATH}:${JSON.stringify(error)}`
    );
  }
}
