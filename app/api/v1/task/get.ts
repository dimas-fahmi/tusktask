import { Ratelimit } from "@upstash/ratelimit";
import { and, count, eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import z, { prettifyError } from "zod";
import { db } from "@/src/db";
import { TASK_STATUSES } from "@/src/db/schema/configs";
import {
  type ProjectMembershipType,
  projectMembership,
} from "@/src/db/schema/project";
import { task } from "@/src/db/schema/task";
import type {
  ExtendedTaskType,
  StandardResponseType,
  StandardV1GetResponse,
} from "@/src/lib/app/app";
import { StandardError } from "@/src/lib/app/errors";
import { auth } from "@/src/lib/auth";
import { rateLimiter } from "@/src/lib/redis/rateLimiter";
import { createResponse } from "@/src/lib/utils/createResponse";
import { getClientIp } from "@/src/lib/utils/getClientIp";
import { getLimitAndOffset, getTotalPages } from "@/src/lib/utils/pagination";
import { getWhereClauseBuilder } from "./getWhereClauseBuilder";

const PATH = "V1_TASK_GET";
const strictPolicyLimiter = rateLimiter({
  limiter: Ratelimit.slidingWindow(50, "10s"),
});

export const TaskStatusTypeSchema = z.enum(TASK_STATUSES);

export const v1TaskGetRequestSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  priority: z.coerce.number().min(0).optional(),
  priorityGt: z.coerce.number().min(0).optional(),
  priorityLt: z.coerce.number().min(1).optional(),
  status: TaskStatusTypeSchema.optional(),
  createdById: z.string().optional(),
  ownerId: z.string().optional(),
  claimedById: z.string().optional(),
  completedById: z.string().optional(),
  projectId: z.string().optional(),
  parentId: z.string().optional(),

  startAtGt: z.coerce.date().optional(),
  startAtLt: z.coerce.date().optional(),

  endAtGt: z.coerce.date().optional(),
  endAtLt: z.coerce.date().optional(),

  completedAtGt: z.coerce.date().optional(),
  completedAtLt: z.coerce.date().optional(),

  createdAtGt: z.coerce.date().optional(),
  createdAtLt: z.coerce.date().optional(),

  updatedAtGt: z.coerce.date().optional(),
  updatedAtLt: z.coerce.date().optional(),

  // Filter
  isPinned: z.stringbool().optional(),
  isArchived: z.stringbool().optional(),
  isDeleted: z.stringbool().optional(),
  isCompleted: z.stringbool().optional(),
  isOverdue: z.stringbool().optional(),
  isStartAtNull: z.stringbool().optional(),
  isEndAtNull: z.stringbool().optional(),
  isUpdatedAtNull: z.stringbool().optional(),

  // Filter by null
  noStartAt: z.stringbool().optional(),
  noEndAt: z.stringbool().optional(),

  // Pagination & Sorting
  orderBy: z
    .enum([
      "name",
      "priority",
      "status",
      "createdAt",
      "updatedAt",
      "startAt",
      "endAt",
      "deletedAt",
    ])
    .optional(),
  orderDirection: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().min(1).optional(),
});

export type V1TaskGetRequest = z.infer<typeof v1TaskGetRequestSchema>;
export type V1TaskGetResult = StandardV1GetResponse<ExtendedTaskType[]>;
export type V1TaskGetResponse = StandardResponseType<V1TaskGetResult>;

export async function v1TaskGet(request: NextRequest) {
  // Rate Limiter
  const ip = getClientIp(request);
  const { success } = await strictPolicyLimiter.limit(ip);

  if (!success) {
    return createResponse(
      "too_many_requests",
      "You are being rate limited, please try again later",
      429,
    );
  }

  // Validate Session
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  if (!user) {
    return createResponse(
      "invalid_session",
      "Invalid session, please log back in",
      401,
    );
  }

  // Parse parameters
  const url = request.nextUrl;
  const { data: parameters, error: requestError } = v1TaskGetRequestSchema
    .strict()
    .safeParse(Object.fromEntries(url.searchParams.entries()));

  if (requestError) {
    return createResponse("bad_request", prettifyError(requestError), 400);
  }

  // Sorting
  const orderBy: V1TaskGetRequest["orderBy"] =
    parameters?.orderBy || "createdAt";
  const orderDirection: V1TaskGetRequest["orderDirection"] =
    parameters?.orderDirection || "desc";

  // Pagination
  const { limit, offset } = getLimitAndOffset(parameters?.page || 1);

  // Where Clause
  const where = getWhereClauseBuilder(parameters);

  // Execution
  try {
    const response: V1TaskGetResult = {
      page: parameters?.page || 1,
      totalPages: 0,
      totalResults: 0,
      result: [],
    };

    // Validate Membership
    let memberships: ProjectMembershipType[] | undefined;
    try {
      memberships = await db
        .select()
        .from(projectMembership)
        .where(eq(projectMembership.userId, user.id));
    } catch (error) {
      throw new StandardError(
        "unknown_database_error",
        "Unknown error when fetching memberships",
        500,
        error,
      );
    }

    if (!memberships.length) {
      return createResponse("record_fetched", "Success", 200, response);
    }

    // Insert Memberships
    const projectIds = memberships.map((membership) => membership.projectId);
    where.push(inArray(task.projectId, projectIds));

    // Execution
    const queryResult = await db.query.task.findMany({
      where: and(...where),
      with: {
        createdBy: {
          columns: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        ownedBy: {
          columns: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        claimedBy: {
          columns: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        completedBy: {
          columns: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        parent: true,
        children: true,
        project: true,
      },
      limit,
      offset,
      orderBy: (task, { asc, desc }) =>
        orderDirection === "asc" ? asc(task[orderBy]) : desc(task[orderBy]),
    });

    response.result = queryResult;

    const [countResult] = await db
      .select({ count: count() })
      .from(task)
      .where(and(...where));

    const totalResults = Number(countResult.count);
    response.totalResults = totalResults;
    response.totalPages = getTotalPages(totalResults);
    return createResponse("record_fetched", "Success", 200, response);
  } catch (error) {
    if (error instanceof StandardError) {
      return createResponse(error.code, error.message, error.status);
    } else {
      return createResponse(
        "unknown_database_error",
        "Unknown error when fetching tasks",
        500,
        undefined,
        "error",
        PATH,
        error,
      );
    }
  }
}
