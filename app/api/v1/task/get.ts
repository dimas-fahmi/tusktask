import {
  and,
  count,
  eq,
  gt,
  inArray,
  isNotNull,
  isNull,
  lt,
  type SQL,
  sql,
} from "drizzle-orm";
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

const PATH = "V1_TASK_GET";
const strictPolicyLimiter = rateLimiter();

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
  isPinned: z.enum(["true", "false"]).optional(),
  isArchived: z.enum(["true", "false"]).optional(),
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

  isDeleted: z.literal("true").optional(),

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

  page: z.coerce.number().optional(),
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

  // Query Builder
  const where = [] as SQL<unknown>[];

  // Search by id
  if (parameters?.id) {
    where.push(eq(task.id, parameters.id));
  }

  // Search by name
  if (parameters?.name) {
    where.push(
      sql`to_tsvector('simple', ${task.name}) @@ plainto_tsquery('simple', ${parameters?.name})`,
    );
  }

  // Search by priority
  if (parameters?.priority) {
    where.push(eq(task.priority, parameters.priority));
  }

  if (parameters?.priorityGt) {
    where.push(gt(task.priority, parameters.priorityGt));
  }

  if (parameters?.priorityLt) {
    where.push(lt(task.priority, parameters.priorityLt));
  }

  // Search by status
  if (parameters?.status) {
    where.push(eq(task.status, parameters.status));
  }

  // Search by creator
  if (parameters?.createdById) {
    where.push(eq(task.createdById, parameters?.createdById));
  }

  // Search by owner id
  if (parameters?.ownerId) {
    where.push(eq(task.ownerId, parameters.ownerId));
  }

  // Search by claimer
  if (parameters?.claimedById) {
    where.push(eq(task.ownerId, parameters.claimedById));
  }

  // Filter by isPinned
  if (parameters?.isPinned === "true") {
    where.push(eq(task.isPinned, true));
  }

  if (parameters?.isPinned === "false") {
    where.push(eq(task.isPinned, false));
  }

  // Filter by isArchived
  if (parameters?.isArchived === "true") {
    where.push(eq(task.isArchived, true));
  }

  if (parameters?.isArchived === "false") {
    where.push(eq(task.isArchived, false));
  }

  // Filter by isDeleted
  if (parameters?.isDeleted === "true") {
    where.push(isNotNull(task.deletedAt));
  } else {
    where.push(isNull(task.deletedAt));
  }

  // Filter by startAt
  if (parameters?.startAtGt) {
    where.push(gt(task.createdAt, parameters.startAtGt));
  }

  if (parameters?.startAtLt) {
    where.push(lt(task.createdAt, parameters.startAtLt));
  }

  // Filter by endAt
  if (parameters?.endAtGt) {
    where.push(gt(task.createdAt, parameters.endAtGt));
  }

  if (parameters?.endAtLt) {
    where.push(lt(task.createdAt, parameters.endAtLt));
  }

  // Filter by completedAt
  if (parameters?.completedAtGt) {
    where.push(gt(task.createdAt, parameters.completedAtGt));
  }

  if (parameters?.completedAtLt) {
    where.push(lt(task.createdAt, parameters.completedAtLt));
  }

  // Filter by createdAt
  if (parameters?.createdAtGt) {
    where.push(gt(task.createdAt, parameters.createdAtGt));
  }

  if (parameters?.createdAtLt) {
    where.push(lt(task.createdAt, parameters.createdAtLt));
  }

  // Sorting
  const orderBy: V1TaskGetRequest["orderBy"] =
    parameters?.orderBy || "createdAt";
  const orderDirection: V1TaskGetRequest["orderDirection"] =
    parameters?.orderDirection || "desc";

  // Pagination
  const { limit, offset } = getLimitAndOffset(parameters?.page || 1);

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
      orderBy: (image, { asc, desc }) =>
        orderDirection === "asc" ? asc(image[orderBy]) : desc(image[orderBy]),
    });

    response.result = queryResult;

    const [countResult] = await db
      .select({ count: count() })
      .from(task)
      .where(and(...where));

    response.totalResults = countResult.count;
    response.totalPages = getTotalPages(countResult.count);
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
