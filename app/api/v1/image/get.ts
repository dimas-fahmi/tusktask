import { and, count, eq, isNotNull, isNull, sql } from "drizzle-orm";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { prettifyError } from "zod";
import { db } from "@/src/db";
import { ImageSchema, type ImageType, image } from "@/src/db/schema/image";
import type {
  StandardResponseType,
  StandardV1GetResponse,
} from "@/src/lib/app/app";
import { auth } from "@/src/lib/auth";
import { rateLimiter } from "@/src/lib/redis/rateLimiter";
import { createResponse } from "@/src/lib/utils/createResponse";
import { getLimitAndOffset, getTotalPages } from "@/src/lib/utils/pagination";

const PATH = "V1_IMAGE_GET";

const VALID_ORDER_FIELDS = ["name", "createdAt", "deletedAt"] as const;

export interface V1ImageGetRequest {
  ownership: ImageType["ownership"];
  isDeleted?: "true";
  page?: number;
  id?: string;
  name?: string;
  tagsAnd?: string;
  tagsOr?: string;
  orderBy?: (typeof VALID_ORDER_FIELDS)[number];
  orderDirection?: "asc" | "desc";
}

export type V1ImageGetResponse = StandardResponseType<
  StandardV1GetResponse<ImageType[]>
>;

const strictPolicyRateLimiter = rateLimiter();

export async function v1ImageGet(request: NextRequest) {
  // Rate Limit
  const ip = request.headers.get("x-real-ip") ?? "127.0.0.1";

  const { success: strictPolicyPassed } =
    await strictPolicyRateLimiter.limit(ip);

  if (!strictPolicyPassed) {
    return createResponse(
      "too_many_requests",
      "You are being rate limited",
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
      "Invalid session, please log back in.",
      401,
    );
  }

  // Extract query parameters
  const url = request.nextUrl;
  const parameters = Object.fromEntries(
    url.searchParams.entries(),
  ) as unknown as V1ImageGetRequest;

  // Validate Request
  const validation = ImageSchema.partial().safeParse(parameters);

  if (!validation.success) {
    return createResponse(
      "bad_request",
      prettifyError(validation.error),
      400,
      validation,
    );
  }

  // Validate Request
  if (!parameters?.ownership) {
    return createResponse(
      "bad_request",
      "Missing important parameters: ownership",
      400,
    );
  }

  // Get Limit & Offset
  const pagination = getLimitAndOffset(parameters?.page ?? 1);

  // Query Builder
  const where = [];

  // Always search by ownership
  if (parameters.ownership === "user_owned") {
    where.push(
      and(eq(image.ownerId, user.id), eq(image.ownership, "user_owned")),
    );
  } else {
    where.push(eq(image.ownership, "system"));
  }

  // Search by Id
  if (parameters?.id) {
    where.push(eq(image.id, parameters.id));
  }

  // Search by name
  if (parameters?.name) {
    where.push(
      sql`to_tsvector('english', ${image.name}) @@ to_tsquery('english', ${parameters.name})`,
    );
  }

  // Search by tags (AND)
  if (parameters?.tagsAnd) {
    const tagsAnd = parameters?.tagsAnd.split(",").map((t) => t.trim());
    where.push(sql`${image.tags} @> ${JSON.stringify(tagsAnd)}::jsonb`);
  }

  // Search by tags (OR)
  if (parameters?.tagsOr) {
    const tagsOr = parameters?.tagsOr.split(",").map((t) => t.trim());
    where.push(sql`${image.tags} && ${tagsOr}::text[]`);
  }

  // Always search by deletion status
  const isDeleted = parameters?.isDeleted === "true";
  where.push(isDeleted ? isNotNull(image.deletedAt) : isNull(image.deletedAt));

  // Order
  const orderDirection = parameters?.orderDirection === "asc" ? "asc" : "desc";
  const orderField =
    parameters?.orderBy && VALID_ORDER_FIELDS.includes(parameters.orderBy)
      ? parameters.orderBy
      : "createdAt";

  try {
    const result = await db.query.image.findMany({
      where: and(...where),
      limit: pagination.limit,
      offset: pagination.offset,
      orderBy: (image, { asc, desc }) =>
        orderDirection === "asc"
          ? asc(image[orderField])
          : desc(image[orderField]),
    });

    const [countResult] = await db
      .select({ count: count() })
      .from(image)
      .where(and(...where));

    return createResponse<StandardV1GetResponse<ImageType[]>>(
      "record_fetched",
      "Success",
      200,
      {
        page: parameters?.page ?? 1,
        totalPages: getTotalPages(countResult.count),
        totalResults: countResult.count,
        result,
      },
    );
  } catch (error) {
    return createResponse(
      "unknown_database_error",
      "Unknown error when fetching data",
      500,
      undefined,
      "error",
      PATH,
      error,
    );
  }
}
