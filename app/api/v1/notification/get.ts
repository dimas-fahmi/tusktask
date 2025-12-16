import { Ratelimit } from "@upstash/ratelimit";
import {
  and,
  count,
  eq,
  gt,
  isNotNull,
  isNull,
  lt,
  type SQL,
} from "drizzle-orm";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { prettifyError, z } from "zod";
import { db } from "@/src/db";
import {
  type NotificationType,
  notificationReceive,
} from "@/src/db/schema/notification";
import type {
  StandardResponseType,
  StandardV1GetResponse,
} from "@/src/lib/app/app";
import { auth } from "@/src/lib/auth";
import { rateLimiter } from "@/src/lib/redis/rateLimiter";
import { createResponse } from "@/src/lib/utils/createResponse";
import { getClientIp } from "@/src/lib/utils/getClientIp";
import { getLimitAndOffset, getTotalPages } from "@/src/lib/utils/pagination";

const PATH = "V1_NOTIFICATION_GET" as const;

export const v1NotificationGetRequestSchema = z.object({
  id: z.uuid().optional(),
  isArchived: z.stringbool().optional(),
  isRead: z.stringbool().optional(),

  createdAtGt: z.coerce.date().optional(),
  createdAtLt: z.coerce.date().optional(),

  orderBy: z.enum(["createdAt"]).optional(),
  orderDirection: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().min(1).optional(),
});

export type V1NotificationGetRequest = z.infer<
  typeof v1NotificationGetRequestSchema
>;
export type V1NotificationGetResult = StandardV1GetResponse<NotificationType[]>;
export type V1NotificationGetResponse =
  StandardResponseType<V1NotificationGetResult>;

const limiterPolicy = rateLimiter({
  limiter: Ratelimit.slidingWindow(50, "10s"),
});

export async function v1NotificationGet(request: NextRequest) {
  // Rate Limit
  const ip = getClientIp(request);
  const { success: passedLimiter } = await limiterPolicy.limit(ip);

  if (!passedLimiter) {
    return createResponse(
      "too_many_requests",
      "You are being rate limited, please try again in a few moment",
      429,
      undefined,
      "warn",
      PATH,
      "RATE_LIMITER_TRIGGERED",
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
      "Session invalid, please log back in.",
      401,
      undefined,
      "warn",
      PATH,
      "SESSION_INVALID",
    );
  }

  // Parse request & Validation
  const url = request.nextUrl;
  const { data: parameters, error: parametersValidationError } =
    v1NotificationGetRequestSchema
      .strict()
      .safeParse(Object.fromEntries(url.searchParams.entries()));

  if (parametersValidationError) {
    return createResponse(
      "bad_request",
      prettifyError(parametersValidationError),
      400,
      parametersValidationError,
      "error",
      PATH,
      parametersValidationError,
    );
  }

  // Where clause builder
  const where: SQL<unknown>[] = [];

  // Always search by userId
  where.push(eq(notificationReceive.userId, user.id));

  // Search by ID
  if (parameters?.id) {
    where.push(eq(notificationReceive.notificationId, parameters.id));
  }

  // Filter by archive
  if (typeof parameters?.isArchived === "boolean") {
    where.push(eq(notificationReceive.isArchived, parameters.isArchived));
  }

  // Filter by read status
  if (typeof parameters?.isRead === "boolean") {
    if (parameters.isRead) {
      where.push(isNotNull(notificationReceive.readAt));
    } else {
      where.push(isNull(notificationReceive.readAt));
    }
  }

  // Filter by createdAtGt
  if (parameters?.createdAtGt) {
    where.push(gt(notificationReceive.createdAt, parameters.createdAtGt));
  }

  // Filter by createdAtLt
  if (parameters?.createdAtLt) {
    where.push(lt(notificationReceive.createdAt, parameters.createdAtLt));
  }

  const { limit, offset } = getLimitAndOffset(parameters?.page || 1);
  const orderBy = parameters?.orderBy || "createdAt";
  const orderDirection = parameters?.orderDirection || "desc";

  // Execute
  try {
    const receives = await db.query.notificationReceive.findMany({
      where: and(...where),
      with: {
        notification: true,
      },
      limit,
      offset,
      orderBy: (receive, { asc, desc }) => {
        if (orderDirection === "asc") {
          return asc(receive[orderBy]);
        } else {
          return desc(receive[orderBy]);
        }
      },
    });

    const result: V1NotificationGetResult = {
      page: parameters?.page || 1,
      totalPages: 1,
      totalResults: 0,
      result: [],
    };

    if (!receives.length) {
      return createResponse<V1NotificationGetResult>(
        "record_fetched",
        "Notification fetched and found none",
        200,
        result,
      );
    }

    const [countResult] = await db
      .select({ count: count() })
      .from(notificationReceive)
      .where(and(...where));
    const totalResults = countResult?.count;
    const totalPages = getTotalPages(totalResults);
    const notifications: NotificationType[] = receives.flatMap(
      (r) => r?.notification || [],
    );

    result.totalResults = totalResults;
    result.totalPages = totalPages;
    result.result = notifications;

    return createResponse<V1NotificationGetResult>(
      "record_fetched",
      "Record fetched and found",
      200,
      result,
    );
  } catch (error) {
    return createResponse(
      "unknown_database_error",
      "Unknown error when fetching notifications",
      500,
      undefined,
      "error",
      PATH,
      error,
    );
  }
}
