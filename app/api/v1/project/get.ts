import {
  and,
  count,
  eq,
  gt,
  inArray,
  isNotNull,
  isNull,
  lt,
  sql,
} from "drizzle-orm";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import z, { prettifyError } from "zod";
import { db } from "@/src/db";
import { project, projectMembership } from "@/src/db/schema/project";
import type {
  ExtendedProjectType,
  StandardResponseType,
  StandardV1GetResponse,
} from "@/src/lib/app/app";
import { auth } from "@/src/lib/auth";
import { rateLimiter } from "@/src/lib/redis/rateLimiter";
import { createResponse } from "@/src/lib/utils/createResponse";
import { getClientIp } from "@/src/lib/utils/getClientIp";
import { getLimitAndOffset, getTotalPages } from "@/src/lib/utils/pagination";

const PATH = "V1_PROJECT_GET";

export const v1ProjectGetRequestSchema = z.object({
  // Metadata
  id: z.uuid().optional(),
  name: z.string().optional(),

  // Statuses
  isPinned: z.coerce.boolean().optional(),
  isArchived: z.coerce.boolean().optional(),
  isDeleted: z.coerce.boolean().optional(),

  // Ownerships
  createdById: z.string().optional(),
  ownerId: z.string().optional(),

  // Timestamps
  createdAtGt: z.coerce.date().optional(),
  createdAtLt: z.coerce.date().optional(),
  updatedAtGt: z.coerce.date().optional(),
  updatedAtLt: z.coerce.date().optional(),

  // Pagination
  page: z.coerce.number().min(1).optional(),
});

export type V1ProjectGetRequest = z.infer<typeof v1ProjectGetRequestSchema>;
export type V1ProjectGetResult = StandardV1GetResponse<ExtendedProjectType[]>;
export type V1ProjectGetResponse = StandardResponseType<V1ProjectGetResult>;

const strictPolicyLimiter = rateLimiter();

export async function v1ProjectGet(request: NextRequest) {
  // Rate Limiter
  const ip = getClientIp(request);
  const { success } = await strictPolicyLimiter.limit(ip);

  if (!success) {
    return createResponse(
      "too_many_requests",
      "You are being rate limited",
      429,
    );
  }

  // Session Validation
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  if (!user) {
    return createResponse(
      "invalid_session",
      "Invalid session, please log back in",
      400,
      undefined,
      "error",
      PATH,
      "NO SESSION",
    );
  }

  // Extract query parameters & Validate
  const url = request.nextUrl;
  const { data: parameters, error: requestValidationError } =
    v1ProjectGetRequestSchema
      .strict()
      .safeParse(Object.fromEntries(url.searchParams.entries()));

  if (requestValidationError) {
    return createResponse(
      "bad_request",
      prettifyError(requestValidationError),
      400,
      requestValidationError,
    );
  }

  // Query Builder
  const where = [];

  // Serach by id
  if (parameters?.id) {
    where.push(eq(project.id, parameters.id));
  }

  // Search by name
  if (parameters?.name) {
    where.push(
      sql`to_tsvector('simple', ${project.name}) @@ plainto_tsquery('simple', ${parameters?.name})`,
    );
  }

  // Filter pinned projects
  if (parameters?.isPinned) {
    where.push(eq(project.isPinned, true));
  }

  // Filter archived projects
  if (parameters?.isArchived) {
    where.push(eq(project.isArchived, true));
  }

  // Always excluded deleted project
  if (parameters?.isDeleted) {
    where.push(isNotNull(project.deletedAt));
  } else {
    where.push(isNull(project.deletedAt));
  }

  // Search by creator
  if (parameters?.createdById) {
    where.push(eq(project.createdById, parameters.createdById));
  }

  // Search by owner
  if (parameters?.ownerId) {
    where.push(eq(project.ownerId, parameters.ownerId));
  }

  // Search by createdAt
  if (parameters?.createdAtGt) {
    where.push(gt(project.createdAt, parameters.createdAtGt));
  }
  if (parameters?.createdAtLt) {
    where.push(lt(project.createdAt, parameters.createdAtLt));
  }

  // Search by updatedAt
  if (parameters?.updatedAtGt) {
    where.push(gt(project.updatedAt, parameters.updatedAtGt));
  }
  if (parameters?.updatedAtLt) {
    where.push(lt(project.updatedAt, parameters.updatedAtLt));
  }

  // Pagination
  const pagination = getLimitAndOffset(parameters?.page || 1);

  // Execution
  try {
    // 1. Get Memberships
    const memberships = await db
      .select()
      .from(projectMembership)
      .where(eq(projectMembership.userId, user.id));

    // 2. Inject memberships
    const membershipIds = memberships.map((item) => item.projectId);
    where.push(inArray(project.id, membershipIds));

    if (membershipIds.length === 0) {
      return createResponse<V1ProjectGetResult>(
        "record_fetched",
        "Success",
        200,
        {
          page: parameters?.page ?? 1,
          totalPages: 0,
          totalResults: 0,
          result: [],
        },
      );
    }

    const result = await db.query.project.findMany({
      where: where.length ? and(...where) : undefined,
      with: {
        memberships: {
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
        },
      },
      limit: pagination.limit,
      offset: pagination.offset,
    });

    const [countResult] = await db
      .select({ count: count() })
      .from(project)
      .where(and(...where));

    return createResponse<V1ProjectGetResult>(
      "record_fetched",
      "Success",
      200,
      {
        page: parameters?.page ?? 1,
        totalPages: getTotalPages(countResult.count),
        totalResults: countResult?.count,
        result,
      },
    );
  } catch (error) {
    return createResponse(
      "unknown_error",
      "Unknown error when fetching record",
      500,
      undefined,
      "error",
      PATH,
      error,
    );
  }
}
