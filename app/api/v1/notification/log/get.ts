import { Ratelimit } from "@upstash/ratelimit";
import { and, count, eq, gt, lt, type SQL } from "drizzle-orm";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import z, { prettifyError } from "zod";
import { db } from "@/src/db";
import {
  type NotificationType,
  notification,
} from "@/src/db/schema/notification";
import {
  type ProjectMembershipType,
  projectMembership,
} from "@/src/db/schema/project";
import type {
  StandardResponseType,
  StandardV1GetResponse,
} from "@/src/lib/app/app";
import { StandardError } from "@/src/lib/app/errors";
import { auth } from "@/src/lib/auth";
import { rateLimiter } from "@/src/lib/redis/rateLimiter";
import { createResponse } from "@/src/lib/utils/createResponse";
import { getClientIp } from "@/src/lib/utils/getClientIp";
import { getLimitAndOffset, getTotalPages } from "@/src/lib/utils/pagination";

const PATH = "V1_NOTIFICATION_LOG_GET" as const;

export const v1NotificationLogGetRequestSchema = z.object({
  projectId: z.uuid(),
  taskId: z.uuid().optional(),
  actorId: z.string().optional(),

  createdAtGt: z.coerce.date().optional(),
  createdAtLt: z.coerce.date().optional(),

  page: z.coerce.number().min(1).optional(),
});

export type V1NotificationLogGetRequest = z.infer<
  typeof v1NotificationLogGetRequestSchema
>;
export type V1NotificationLogGetResult = StandardV1GetResponse<
  NotificationType[]
>;
export type V1NotificationLogGetResponse =
  StandardResponseType<V1NotificationLogGetResult>;

const limiter = rateLimiter({
  limiter: Ratelimit.slidingWindow(50, "10s"),
});

export async function v1NotificationLogGet(request: NextRequest) {
  // Rate Limit
  const ip = getClientIp(request);
  const { success: passedLimiter } = await limiter.limit(ip);

  if (!passedLimiter) {
    return createResponse(
      "too_many_requests",
      "You are being rate limited, please try again shortly",
      429,
      undefined,
      "warn",
      PATH,
      "RATE_LIMITER_TRIGGERED",
    );
  }

  // Session validation
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return createResponse(
      "invalid_session",
      "Invalid session, please log back in",
      401,
      undefined,
      "warn",
      PATH,
      "INVALID_SESSION",
    );
  }

  // Validate Request
  const url = request.nextUrl;
  const { data: parameters, error: requestError } =
    v1NotificationLogGetRequestSchema
      .strict()
      .safeParse(Object.fromEntries(url.searchParams.entries()));

  if (requestError) {
    return createResponse(
      "bad_request",
      prettifyError(requestError),
      400,
      requestError,
      "error",
      PATH,
      requestError,
    );
  }

  // Query Builder
  const where: SQL<unknown>[] = [];

  // Always search by projectId
  if (parameters.projectId) {
    where.push(eq(notification.projectId, parameters.projectId));
  }

  // Search by task
  if (parameters?.taskId) {
    where.push(eq(notification.taskId, parameters.taskId));
  }

  // Search by actor
  if (parameters?.actorId) {
    where.push(eq(notification.actorId, parameters.actorId));
  }

  // Search by createdAtGt
  if (parameters?.createdAtGt) {
    where.push(gt(notification.createdAt, parameters.createdAtGt));
  }

  if (parameters?.createdAtLt) {
    where.push(lt(notification.createdAt, parameters.createdAtLt));
  }

  // Pagination
  const { limit, offset } = getLimitAndOffset(parameters?.page || 1);

  // Execution
  try {
    // 1. Validate Membership
    let membership: ProjectMembershipType | undefined;
    try {
      membership = await db.query.projectMembership.findFirst({
        where: and(
          eq(projectMembership.userId, session.user.id),
          eq(projectMembership.projectId, parameters.projectId),
        ),
      });
    } catch (error) {
      throw new StandardError(
        "unknown_database_error",
        "Unknown error when fetching membership",
        500,
        error,
      );
    }

    if (!membership) {
      throw new StandardError(
        "unauthorized",
        "Not a member of this project",
        403,
        "UNAUTHORIZED",
      );
    }

    // 2. Fetch logs
    const results = await db.query.notification.findMany({
      where: and(...where),
      with: {
        actor: {
          columns: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        project: true,
        task: true,
      },
      limit,
      offset,
    });

    const response: V1NotificationLogGetResult = {
      page: parameters?.page || 1,
      totalPages: 1,
      totalResults: 0,
      result: results,
    };

    if (results.length > 0) {
      const [countResult] = await db
        .select({ count: count() })
        .from(notification)
        .where(and(...where));

      response.totalResults = countResult.count;
      response.totalPages = getTotalPages(countResult.count);
    }

    return createResponse<V1NotificationLogGetResult>(
      "record_fetched",
      "Notifications fetched",
      200,
      response,
    );
  } catch (error) {
    if (error instanceof StandardError) {
      return createResponse(
        error.code,
        error.message,
        error.status,
        undefined,
        "error",
        PATH,
        error?.context,
      );
    } else {
      return createResponse(
        "unknown_error",
        "Unknown error when fetching logs",
        500,
        undefined,
        "error",
        PATH,
        error,
      );
    }
  }
}
