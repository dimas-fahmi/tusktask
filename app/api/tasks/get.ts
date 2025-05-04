import { db } from "@/src/db";
import { tasks, tasksToUsers } from "@/src/db/schema/tasks";
import { and, eq, ilike, inArray, lt } from "drizzle-orm";
import { filterFields, TasksGetApiRequest } from "./types";
import { getSearchParams } from "@/src/lib/tusktask/utils/url/getSearchParams";
import { NextResponse } from "next/server";
import { createStandardLog } from "@/src/lib/tusktask/utils/api/createStandardLog";
import createNextResponse from "@/src/lib/tusktask/utils/json/createNextResponse";

export const userConfigs = {
  id: true,
  name: true,
  image: true,
  userName: true,
};

export const tasksGet = async (req: Request) => {
  console.log(createStandardLog("tasks", null, "GET", "INCOMING_REQUEST"));

  const url = new URL(req.url);
  const body: TasksGetApiRequest = getSearchParams(url, filterFields);

  const { ownerId, createdById } = body;

  if (!ownerId && !createdById) {
    console.error(createStandardLog("tasks", null, "GET", "BAD_REQUEST"));

    return createNextResponse(400, {
      message: "Missing important parameters",
      userFriendly: false,
    });
  }

  const where = [];

  if (ownerId) {
    where.push(eq(tasks.ownerId, ownerId));
  }

  if (createdById) {
    where.push(eq(tasks.createdById, createdById));
  }

  // Filter Construction
  if (body.name) {
    where.push(ilike(tasks.name, `%${body.name}%`));
  }

  if (body.tags) {
    const tags = body.tags.split(",");
    where.push(inArray(tasks.tags, [tags]));
  }

  if (body.status) {
    where.push(eq(tasks.status, body.status));
  }

  if (typeof body.overdue === "string") {
    body.overdue = body.overdue === "true" ? true : false;
  }

  if (body.overdue) {
    const now = new Date();
    where.push(lt(tasks.deadlineAt, now));
  }

  // Pagination Constants
  let limit: number = 10;
  if (body.limit) {
    limit = parseInt(body.limit, 10);
  }

  let offset: number = 0;
  if (body.offset) {
    offset = parseInt(body.offset, 10);
  }

  if (isNaN(limit) || isNaN(offset)) {
    return createNextResponse(400, {
      message: "Invalid limit or offset value",
      userFriendly: false,
    });
  }

  // Fetching
  try {
    const result = await db.query.tasks.findMany({
      where: and(...where),
      with: {
        owner: {
          columns: userConfigs,
        },
        creator: {
          columns: userConfigs,
        },
        project: true,
        tasksToUsers: {
          columns: {},
          with: {
            user: {
              columns: userConfigs,
            },
          },
        },
      },
      limit: limit,
      offset: offset,
    });

    if (result.length < 1) {
      console.log(createStandardLog("tasks", null, "GET", "NOT_FOUND"));
      return createNextResponse(404, {
        message: "No such tasks is found",
        userFriendly: false,
        data: result,
      });
    }

    return createNextResponse(200, {
      message: "SUCCESS, returning tasks",
      userFriendly: false,
      data: result,
    });
  } catch (error) {
    console.error(createStandardLog("tasks", null, "GET", "UNEXPECTED_ERROR"));
    return createNextResponse(500, {
      message: "Something went wrong, please try again.",
      userFriendly: true,
    });
  }
};
