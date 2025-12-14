import { and, count, eq, inArray, sql } from "drizzle-orm";
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

export type V1ProjectGetRequest = {
  name?: string;
  isPinned?: "true";
  isArchived?: "true";
  page?: number;
};

export type V1ProjectGetResult = StandardV1GetResponse<ExtendedProjectType[]>;

export type V1ProjectGetResponse = StandardResponseType<V1ProjectGetResult>;

const strictPolicyLimiter = rateLimiter();

const querySchema = z.object({
  name: z.string().optional(),
  isPinned: z.literal("true").optional(),
  isArchived: z.literal("true").optional(),
  page: z.coerce.number().int().min(1).optional(),
});

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
    );
  }

  // Extract query parameters & Validate
  const url = request.nextUrl;
  const parsed = querySchema.safeParse(
    Object.fromEntries(url.searchParams.entries()),
  );
  if (!parsed.success) {
    return createResponse("bad_request", prettifyError(parsed.error), 400);
  }
  const parameters = parsed.data;

  // Query Builder
  const where = [];

  // Search by name
  if (parameters?.name) {
    where.push(
      sql`to_tsvector('english', ${project.name}) @@ to_tsquery('english', ${parameters?.name})`,
    );
  }

  // Filter archived projects
  if (parameters?.isArchived === "true") {
    where.push(eq(project.isArchived, true));
  }

  // Filter pinned projects
  if (parameters?.isPinned === "true") {
    where.push(eq(project.isPinned, true));
  }

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
      return createResponse("resource_not_found", "No projects found", 404);
    }

    const result = await db.query.project.findMany({
      where: where.length ? and(...where) : undefined,
      with: {
        memberships: true,
      },
      limit: pagination.limit,
      offset: pagination.offset,
    });

    const [countResult] = await db
      .select({ count: count() })
      .from(project)
      .where(and(...where));

    return createResponse<V1ProjectGetResult>("record_fetched", "Sucess", 200, {
      page: parameters?.page ?? 1,
      totalPages: getTotalPages(countResult.count),
      totalResults: countResult?.count,
      result,
    });
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
