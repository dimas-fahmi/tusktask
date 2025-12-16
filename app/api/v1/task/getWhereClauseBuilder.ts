import { eq, gt, isNotNull, isNull, lt, type SQL, sql } from "drizzle-orm";
import { task } from "@/src/db/schema/task";
import type { V1TaskGetRequest } from "./get";

export const getWhereClauseBuilder = (
  parameters: V1TaskGetRequest,
): SQL<unknown>[] => {
  // Query Builder
  const where = [] as SQL<unknown>[];

  // Search by id
  if (parameters?.id) {
    where.push(eq(task.id, parameters.id));
  }

  // Search by name
  if (parameters?.name) {
    where.push(
      sql`to_tsvector('simple', ${task.name}) @@ plainto_tsquery('simple', ${parameters.name})`,
    );
  }

  // Search by priority
  if (parameters?.priority) {
    where.push(eq(task.priority, parameters.priority));
  }

  // Filter by priorityGt
  if (parameters?.priorityGt) {
    where.push(gt(task.priority, parameters.priorityGt));
  }

  // Filter by priorityLt
  if (parameters?.priorityLt) {
    where.push(lt(task.priority, parameters.priorityLt));
  }

  // Search by status
  if (parameters?.status) {
    where.push(eq(task.status, parameters.status));
  }

  // Search by creator
  if (parameters?.createdById) {
    where.push(eq(task.createdById, parameters.createdById));
  }

  // Search by completedById
  if (parameters?.completedById) {
    where.push(eq(task.completedById, parameters.completedById));
  }

  // Search by owner id
  if (parameters?.ownerId) {
    where.push(eq(task.ownerId, parameters.ownerId));
  }

  // Search by claimer
  if (parameters?.claimedById) {
    where.push(eq(task.claimedById, parameters.claimedById));
  }

  // Filter by projectId
  if (parameters?.projectId) {
    where.push(eq(task.projectId, parameters.projectId));
  }

  // Filter by parentId
  if (parameters?.parentId) {
    where.push(eq(task.parentId, parameters.parentId));
  }

  // Filter by isPinned
  if (typeof parameters?.isPinned === "boolean") {
    where.push(eq(task.isPinned, parameters.isPinned));
  }

  // Filter by isArchived
  if (typeof parameters?.isArchived === "boolean") {
    where.push(eq(task.isArchived, parameters.isArchived));
  }

  // Filter by isDeleted (always exclude one and another)
  if (parameters?.isDeleted) {
    where.push(isNotNull(task.deletedAt));
  } else {
    where.push(isNull(task.deletedAt));
  }

  // Filter by completion
  if (typeof parameters?.isCompleted === "boolean") {
    if (parameters?.isCompleted) {
      where.push(isNotNull(task.completedAt));
    } else {
      where.push(isNull(task.completedAt));
    }
  }

  // Filter by startAtGt
  if (parameters?.startAtGt) {
    where.push(gt(task.startAt, parameters.startAtGt));
  }

  // Filter by startAtLt
  if (parameters?.startAtLt) {
    where.push(lt(task.startAt, parameters.startAtLt));
  }

  // Filter by endAtGt
  if (parameters?.endAtGt) {
    where.push(gt(task.endAt, parameters.endAtGt));
  }

  // Filter by endAtLt
  if (parameters?.endAtLt) {
    where.push(lt(task.endAt, parameters.endAtLt));
  }

  // Filter by completedAtGt
  if (parameters?.completedAtGt) {
    where.push(gt(task.completedAt, parameters.completedAtGt));
  }

  // Filter by completedAtLt
  if (parameters?.completedAtLt) {
    where.push(lt(task.completedAt, parameters.completedAtLt));
  }

  // Filter by createdAtGt
  if (parameters?.createdAtGt) {
    where.push(gt(task.createdAt, parameters.createdAtGt));
  }

  // Filter by createdAtLt
  if (parameters?.createdAtLt) {
    where.push(lt(task.createdAt, parameters.createdAtLt));
  }

  // Filter by updatedAtGt
  if (parameters?.updatedAtGt) {
    where.push(gt(task.updatedAt, parameters.updatedAtGt));
  }

  // Filter by updatedAtLt
  if (parameters?.updatedAtLt) {
    where.push(lt(task.updatedAt, parameters.updatedAtLt));
  }

  // Filter by startAt null
  if (typeof parameters?.isStartAtNull === "boolean") {
    if (parameters.isStartAtNull === true) {
      where.push(isNull(task.startAt));
    } else {
      where.push(isNotNull(task.startAt));
    }
  }

  // Filter by endAt null
  if (typeof parameters?.isEndAtNull === "boolean") {
    if (parameters.isEndAtNull === true) {
      where.push(isNull(task.endAt));
    } else {
      where.push(isNotNull(task.endAt));
    }
  }

  // Filter by updatedAt null
  if (typeof parameters?.isUpdatedAtNull === "boolean") {
    if (parameters.isUpdatedAtNull === true) {
      where.push(isNull(task.updatedAt));
    } else {
      where.push(isNotNull(task.updatedAt));
    }
  }

  // Filter overdue tasks
  if (typeof parameters?.isOverdue === "boolean") {
    const now = new Date();
    where.push(isNull(task.completedAt));
    if (parameters?.isOverdue === true) {
      where.push(lt(task.endAt, now));
    } else {
      where.push(gt(task.endAt, now));
    }
  }

  return where;
};
