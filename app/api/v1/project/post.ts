import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { prettifyError } from "zod";
import { db } from "@/src/db";
import {
  type InsertProjectMembershipType,
  type InsertProjectType,
  insertProjectSchema,
  type ProjectMembershipType,
  type ProjectType,
  project,
  projectMembership,
} from "@/src/db/schema/project";
import type { StandardResponseType } from "@/src/lib/app/app";
import { StandardError } from "@/src/lib/app/errors";
import { auth } from "@/src/lib/auth";
import { rateLimiter } from "@/src/lib/redis/rateLimiter";
import { createResponse } from "@/src/lib/utils/createResponse";
import { getClientIp } from "@/src/lib/utils/getClientIp";
import { hasAnyField } from "@/src/lib/utils/hasAnyField";

const PATH = "V1_PROJECT_POST";

export interface V1ProjectPostRequest
  extends Omit<
    InsertProjectType,
    "id" | "ownerId" | "createdAt" | "createdById" | "deletedAt" | "updatedAt"
  > {}
export type V1ProjectPostResponse = StandardResponseType<{
  insertedProject: ProjectType[];
  insertedMembership: ProjectMembershipType[];
}>;

const strictLimiterPolicy = rateLimiter();

export async function v1ProjectPost(request: NextRequest) {
  // Rate Limit
  const ip = getClientIp(request);

  const { success } = await strictLimiterPolicy.limit(ip);

  if (!success) {
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

  // Parse Request
  let body: V1ProjectPostRequest;
  try {
    body = await request.json();
  } catch (error) {
    return createResponse(
      "bad_request",
      "Malformed request, expected: raw JSON",
      400,
      undefined,
      "error",
      PATH,
      error,
    );
  }

  // Validate Request
  const forbiddenFields = [
    "id",
    "createdById",
    "createdAt",
    "deletedAt",
    "updatedAt",
    "ownerId",
  ];
  const isContainsForbiddenField = hasAnyField(body, forbiddenFields);

  if (isContainsForbiddenField) {
    return createResponse("bad_request", "Contains forbidden field", 400);
  }

  const validation = insertProjectSchema
    .omit({ ownerId: true, createdAt: true, id: true, deletedAt: true })
    .safeParse(body);

  if (!validation?.success) {
    return createResponse("bad_request", prettifyError(validation?.error), 400);
  }

  // Construct new Project and new Membership
  const newProjectId = crypto.randomUUID();
  const newProject: InsertProjectType = {
    id: newProjectId,
    ...validation.data,
    createdById: user.id,
    ownerId: user.id,
    createdAt: new Date(),
  };

  const newProjectMembership: InsertProjectMembershipType = {
    userId: user.id,
    projectId: newProjectId,
    type: "owner",
    createdAt: new Date(),
  };

  // Execution
  try {
    const result = await db.transaction(async (tx) => {
      // 1. Create Project
      let insertedProject: ProjectType[] | undefined;
      try {
        insertedProject = await tx
          .insert(project)
          .values(newProject)
          .returning();
      } catch (_error) {
        throw new StandardError(
          "failed_insertion",
          "Failed to create new project",
          500,
        );
      }

      // 2. Create Membership
      let insertedMembership: ProjectMembershipType[] | undefined;
      try {
        insertedMembership = await tx
          .insert(projectMembership)
          .values(newProjectMembership)
          .returning();
      } catch (_error) {
        throw new StandardError(
          "failed_insertion",
          "Failed to insert membership",
          500,
        );
      }

      // 3. Return Result
      return { insertedMembership, insertedProject };
    });

    return createResponse("record_stored", "Project created", 200, result);
  } catch (error) {
    if (error instanceof StandardError) {
      return createResponse(
        error.code,
        error.message,
        error.status ?? 500,
        undefined,
        "error",
        PATH,
        error,
      );
    } else {
      return createResponse(
        "unknown_database_error",
        "Unknown error",
        500,
        undefined,
        "error",
        PATH,
        error,
      );
    }
  }
}
