import { db } from "@/src/db";
import { tasks, tasksToUsers } from "@/src/db/schema/tasks";
import { and, eq, ilike } from "drizzle-orm";
import { filterFields, TasksGetApiRequest } from "./types";
import { getSearchParams } from "@/src/lib/tusktask/utils/url/getSearchParams";
import { NextResponse } from "next/server";
import { createStandardLog } from "@/src/lib/tusktask/utils/api/createStandardLog";
import createNextResponse from "@/src/lib/tusktask/utils/json/createNextResponse";

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

  if (body.name) {
    where.push(ilike(tasks.name, `%${body.name}%`));
  }

  try {
    const result = await db.query.tasks.findMany({
      where: and(...where),
      with: {
        tasksToUsers: {},
      },
    });

    if (result.length < 1) {
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
