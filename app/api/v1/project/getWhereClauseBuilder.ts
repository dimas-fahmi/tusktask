import { eq, gt, isNotNull, isNull, lt, type SQL, sql } from "drizzle-orm";
import { project } from "@/src/db/schema/project";
import type { V1ProjectGetRequest } from "./get";

export const getWhereClauseBuilder = (
  parameters: V1ProjectGetRequest,
): SQL<unknown>[] => {
  // Query Builder
  const where = [];

  // Search by id
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
  if (typeof parameters?.isPinned === "boolean") {
    where.push(eq(project.isPinned, parameters.isPinned));
  }

  // Filter archived projects
  if (typeof parameters?.isArchived === "boolean") {
    where.push(eq(project.isArchived, parameters.isArchived));
  }

  // Filter by deletion (always exclude one and another)
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

  return where;
};
