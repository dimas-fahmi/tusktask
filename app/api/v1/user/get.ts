import { Ratelimit } from "@upstash/ratelimit";
import { and, count, eq, type SQL, sql } from "drizzle-orm";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import z, { prettifyError } from "zod";
import { db } from "@/src/db";
import { user } from "@/src/db/schema/auth-schema";
import type {
  StandardResponseType,
  StandardV1GetResponse,
} from "@/src/lib/app/app";
import { auth } from "@/src/lib/auth";
import { rateLimiter } from "@/src/lib/redis/rateLimiter";
import { createResponse } from "@/src/lib/utils/createResponse";
import { getClientIp } from "@/src/lib/utils/getClientIp";
import { getLimitAndOffset, getTotalPages } from "@/src/lib/utils/pagination";
import { type SanitizedUserType, usernameSchema } from "@/src/lib/zod";

const PATH = "V1_USER_GET" as const;

export const v1UserGetRequestSchema = z.object({
  id: z.string().optional(),
  username: usernameSchema.optional(),
  name: z.string().optional(),

  page: z.coerce.number().min(1).optional(),
});

export type V1UserGetRequest = z.infer<typeof v1UserGetRequestSchema>;
export type V1UserGetResult = StandardV1GetResponse<SanitizedUserType[]>;
export type V1UserGetResponse = StandardResponseType<V1UserGetResult>;

const limiter = rateLimiter({
  limiter: Ratelimit.slidingWindow(50, "10s"),
});

export async function v1UserGet(request: NextRequest) {
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

  // Validate Session
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

  // Parse and validate request
  const url = request.nextUrl;
  const { data: parameters, error: requestError } = v1UserGetRequestSchema
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

  // Validate required parameter
  if (!parameters?.id && !parameters?.name && !parameters?.username) {
    return createResponse(
      "bad_request",
      "At least one parameter is required: id, username, name",
      400,
      undefined,
      "error",
      PATH,
      "MISSING_REQUIRED_PARAMETERS",
    );
  }

  // Query Builder
  const where: SQL<unknown>[] = [];

  // Search by id
  if (parameters?.id) {
    where.push(eq(user.id, parameters.id));
  }

  // Search by username
  if (parameters?.username) {
    where.push(eq(user.username, parameters.username));
  }

  // Search by name
  if (parameters?.name) {
    where.push(
      sql`to_tsvector('simple', ${user.name}) @@ plainto_tsquery('simple', ${parameters.name})`,
    );
  }

  // Pagination
  const { limit, offset } = getLimitAndOffset(parameters?.page || 1);

  // Execution
  try {
    const result = await db.query.user.findMany({
      where: and(...where),
      columns: {
        id: true,
        name: true,
        username: true,
        image: true,
      },
      limit,
      offset,
    });

    const response: V1UserGetResult = {
      page: parameters?.page || 1,
      totalPages: 1,
      totalResults: 0,
      result: result,
    };

    if (result.length > 0) {
      const [countResult] = await db
        .select({ count: count() })
        .from(user)
        .where(and(...where));

      response.totalResults = countResult.count;
      response.totalPages = getTotalPages(countResult.count);
    }

    return createResponse("record_fetched", "Success", 200, response);
  } catch (error) {
    return createResponse(
      "unknown_database_error",
      "Unknown error when fetching users",
      500,
      undefined,
      "error",
      PATH,
      error,
    );
  }
}
