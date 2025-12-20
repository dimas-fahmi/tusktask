import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import z, { prettifyError } from "zod";
import type { StandardResponseType } from "@/src/lib/app/app";
import { auth } from "@/src/lib/auth";
import { rateLimiter } from "@/src/lib/redis/rateLimiter";
import { createResponse } from "@/src/lib/utils/createResponse";
import { getClientIp } from "@/src/lib/utils/getClientIp";
import {
  notificationMessageTypeSchema,
  projectMembershipRoleTypeSchema,
} from "@/src/lib/zod/notification";
import { invite } from "./handler/invite";
import { join } from "./handler/join";

const PATH = "V1_PROJECT_MEMBERSHIP_POST";

export const v1ProjectMembershipPostRequestSchema = z.union(
  [
    // Invite
    z.object({
      action: z.literal("invite"),
      projectId: z.uuid(),
      userId: z.string(),
      targetRole: projectMembershipRoleTypeSchema,
      message: notificationMessageTypeSchema.optional(),
    }),
    z.object({
      action: z.literal("join"),
      notificationId: z.uuid(),
      message: notificationMessageTypeSchema.optional(),
    }),
  ],
  { error: "Invalid request type, please read documentation." },
);

export type V1ProjectMembershipPostRequest = z.infer<
  typeof v1ProjectMembershipPostRequestSchema
>;
export type V1ProjectMembershipPostResponse = StandardResponseType<
  true | undefined
>;

const limiter = rateLimiter();

export async function v1ProjectMembershipPost(request: NextRequest) {
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

  // Parse request body
  let body: V1ProjectMembershipPostRequest | undefined;
  try {
    body = await request.json();
  } catch (error) {
    return createResponse(
      "bad_request",
      "Malformed request, expected: raw json",
      400,
      undefined,
      "error",
      PATH,
      error,
    );
  }

  // Validate request
  const { data: parameters, error: requestError } =
    v1ProjectMembershipPostRequestSchema.safeParse(body);

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

  if (parameters.action === "invite") {
    return invite(session.session, parameters, PATH);
  } else if (parameters.action === "join") {
    return join(session.session, parameters, PATH);
  } else {
    return createResponse(
      "bad_request",
      "Wrong parameters action, either: join or invite",
      400,
      undefined,
      "error",
      PATH,
      "WRONG_PARAMETERS_ACTION",
    );
  }
}
