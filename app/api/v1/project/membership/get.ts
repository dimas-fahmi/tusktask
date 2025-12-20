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
import z, { prettifyError } from "zod";
import { db } from "@/src/db";
import { projectMembership } from "@/src/db/schema/project";
import type {
  ExtendedProjectMembershipType,
  StandardResponseType,
  StandardV1GetResponse,
} from "@/src/lib/app/app";
import { auth } from "@/src/lib/auth";
import { rateLimiter } from "@/src/lib/redis/rateLimiter";
import { createResponse } from "@/src/lib/utils/createResponse";
import { getClientIp } from "@/src/lib/utils/getClientIp";
import { projectMembershipRoleTypeSchema } from "@/src/lib/zod/notification";

const PATH = "V1_PROJECT_MEMBERSHIP_GET";

export const v1ProjectMembershipGetRequestSchema = z.object({
  projectId: z.uuid().optional(),
  userId: z.string().optional(),
  type: projectMembershipRoleTypeSchema.optional(),

  createdAtGt: z.coerce.date().optional(),
  createdAtLt: z.coerce.date().optional(),

  updatedAtGt: z.coerce.date().optional(),
  updatedAtLt: z.coerce.date().optional(),

  orderBy: z.enum(["createdAt", "updatedAt"]).optional(),
  orderDirection: z.enum(["asc", "desc"]).optional(),
  isDeleted: z.stringbool().optional(),
});

export type V1ProjectMembershipGetRequest = z.infer<
  typeof v1ProjectMembershipGetRequestSchema
>;
export type V1ProjectMembershipGetResult = StandardV1GetResponse<
  ExtendedProjectMembershipType[]
>;
export type V1ProjectMembershipGetResponse =
  StandardResponseType<V1ProjectMembershipGetResult>;

const limiter = rateLimiter({
  limiter: Ratelimit.slidingWindow(50, "10s"),
});

export async function v1ProjectMembershipGet(request: NextRequest) {
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

  // Validate session
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

  // Validate request
  const url = request.nextUrl;
  const { data: parameters, error: requestError } =
    v1ProjectMembershipGetRequestSchema
      .strict()
      .safeParse(Object.fromEntries(url.searchParams.entries()));

  if (requestError) {
    return createResponse(
      "bad_request",
      prettifyError(requestError),
      400,
      undefined,
      "error",
      PATH,
      requestError,
    );
  }

  if (!parameters?.projectId && !parameters?.userId) {
    return createResponse(
      "bad_request",
      "Missing required parameters, at least one: projectId, userId",
      400,
      undefined,
      "error",
      PATH,
      "MISSING_IMPORTANT_PARAMETERS",
    );
  }

  // Query Builder
  const where: SQL<unknown>[] = [];

  // Search by projectId
  if (parameters?.projectId) {
    where.push(eq(projectMembership.projectId, parameters.projectId));
  }

  // Search by userId
  if (parameters?.userId) {
    where.push(eq(projectMembership.userId, parameters.userId));
  }

  // Search by type
  if (parameters?.type) {
    where.push(eq(projectMembership.type, parameters.type));
  }

  // Search by createdAtGt
  if (parameters?.createdAtGt) {
    where.push(gt(projectMembership.createdAt, parameters.createdAtGt));
  }

  // Search by createdAtLt
  if (parameters?.createdAtLt) {
    where.push(lt(projectMembership.createdAt, parameters.createdAtLt));
  }

  // Search by updatedAtGt
  if (parameters?.updatedAtGt) {
    where.push(gt(projectMembership.updatedAt, parameters.updatedAtGt));
  }

  // Search by updatedAtLt
  if (parameters?.updatedAtLt) {
    where.push(lt(projectMembership.updatedAt, parameters.updatedAtLt));
  }

  // Search by deletion status
  if (typeof parameters?.isDeleted === "boolean") {
    if (parameters.isDeleted) {
      where.push(isNotNull(projectMembership.deletedAt));
    } else {
      where.push(isNull(projectMembership.deletedAt));
    }
  }

  // Order
  const orderBy = parameters?.orderBy || "createdAt";
  const orderDirection = parameters?.orderDirection || "desc";

  // Executions
  try {
    const result = await db.query.projectMembership.findMany({
      where: and(...where),
      limit: 20,
      with: {
        member: {
          columns: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: (projectMembership, { asc, desc }) =>
        orderDirection === "asc"
          ? asc(projectMembership[orderBy])
          : desc(projectMembership[orderBy]),
    });

    const response: V1ProjectMembershipGetResult = {
      page: 1,
      totalPages: 1,
      totalResults: 0,
      result: result,
    };

    if (result.length > 0) {
      const [countResult] = await db
        .select({ count: count() })
        .from(projectMembership)
        .where(and(...where));

      response.totalResults = countResult.count;
    }
    return createResponse("record_fetched", "Success", 200, response);
  } catch (error) {
    return createResponse(
      "unknown_error",
      "Unknown error when fetching project memberships",
      500,
      undefined,
      "error",
      PATH,
      error,
    );
  }
}
