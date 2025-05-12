import { auth } from "@/auth";
import { db } from "@/src/db";
import {
  projects,
  projectsToUsers,
  ProjectType,
} from "@/src/db/schema/projects";
import createNextResponse from "@/src/lib/tusktask/utils/json/createNextResponse";
import { getSearchParams } from "@/src/lib/tusktask/utils/url/getSearchParams";
import {
  and,
  eq,
  exists,
  gte,
  ilike,
  isNotNull,
  isNull,
  lte,
  or,
  asc,
  desc,
} from "drizzle-orm";

export interface ProjectsGetRequest
  extends Partial<
    Omit<ProjectType, "estimatedHours" | "estimatedMinutes" | "deletedAt">
  > {
  limit?: string;
  offset?: string;
  search?: string;
  estimatedHours?: string;
  estimatedMinutes?: string;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  deadlineAtFrom?: Date;
  deadlineAtTo?: Date;
  deletedAt?: string;
  sortBy?: keyof ProjectType;
  sortOrder?: "asc" | "desc";
}

export interface ProjectsGetResponseData extends ProjectType {
  tasks?: Array<{ name: string; completedAt: Date | null }>;
}

export const queryBuilder = (
  parameters: ProjectsGetRequest,
  userId: string
) => {
  const where = [];

  // Access control: user must be owner or assigned via join table
  const accessCondition = or(
    eq(projects.ownerId, userId),
    exists(
      db
        .select()
        .from(projectsToUsers)
        .where(
          and(
            eq(projectsToUsers.projectId, projects.id),
            eq(projectsToUsers.userId, userId)
          )
        )
    )
  );
  where.push(accessCondition);

  if (parameters.name) {
    where.push(ilike(projects.name, `%${parameters.name}%`));
  }

  if (parameters.search) {
    where.push(
      or(
        ilike(projects.name, `%${parameters.search}%`),
        ilike(projects.description, `%${parameters.search}%`)
      )
    );
  }

  const allowedVisibility: ProjectType["visibility"][] = [
    "private",
    "public",
    "shared",
  ];
  if (
    parameters.visibility &&
    allowedVisibility.includes(parameters.visibility)
  ) {
    where.push(eq(projects.visibility, parameters.visibility));
  }

  const allowedStatus: ProjectType["status"][] = [
    "archived",
    "completed",
    "in_progress",
    "not_started",
  ];
  if (parameters.status && allowedStatus.includes(parameters.status)) {
    where.push(eq(projects.status, parameters.status));
  }

  if (parameters.ownerId) {
    where.push(eq(projects.ownerId, parameters.ownerId));
  }

  if (parameters.createdById) {
    where.push(eq(projects.createdById, parameters.createdById));
  }

  if (parameters.estimatedHours) {
    const hours = parseInt(parameters.estimatedHours);
    if (!isNaN(hours)) {
      where.push(eq(projects.estimatedHours, hours));
    }
  }

  if (parameters.estimatedMinutes !== undefined) {
    const minutes = parseInt(parameters.estimatedMinutes);
    if (!isNaN(minutes)) {
      where.push(eq(projects.estimatedMinutes, minutes));
    }
  }

  if (parameters.createdAtFrom) {
    const from = new Date(parameters.createdAtFrom);
    if (!isNaN(from.getTime())) {
      where.push(gte(projects.createdAt, from));
    }
  }

  if (parameters.createdAtTo) {
    const to = new Date(parameters.createdAtTo);
    if (!isNaN(to.getTime())) {
      where.push(lte(projects.createdAt, to));
    }
  }

  if (parameters.deadlineAtFrom) {
    const from = new Date(parameters.deadlineAtFrom);
    if (!isNaN(from.getTime())) {
      where.push(gte(projects.deadlineAt, from));
    }
  }

  if (parameters.deadlineAtTo) {
    const to = new Date(parameters.deadlineAtTo);
    if (!isNaN(to.getTime())) {
      where.push(lte(projects.deadlineAt, to));
    }
  }

  if (parameters.deletedAt === "true") {
    where.push(isNotNull(projects.deletedAt));
  } else {
    where.push(isNull(projects.deletedAt));
  }

  return where;
};

export const projectsGet = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const requestParameters: ProjectsGetRequest = getSearchParams(url, [
      "limit",
      "offset",
      "name",
      "search",
      "visibility",
      "status",
      "ownerId",
      "createdById",
      "estimatedHours",
      "estimatedMinutes",
      "createdAtFrom",
      "createdAtTo",
      "deadlineAtTo",
      "deadlineAtFrom",
      "deletedAt",
      "sortBy",
      "sortOrder",
    ]);

    const session = await auth();
    if (!session?.user?.id) {
      return createNextResponse(401, {
        message: "Invalid session, please log out and log back in!",
        userFriendly: true,
      });
    }

    const where = queryBuilder(requestParameters, session.user.id);

    const limit = parseInt(requestParameters.limit || "50");
    const offset = parseInt(requestParameters.offset || "0");

    const allowedSortFields: (keyof ProjectType)[] = [
      "completedAt",
      "deletedAt",
      "createdAt",
      "deadlineAt",
      "name",
      "status",
      "startAt",
    ];

    const sortColumnMap = {
      completedAt: projects.completedAt,
      deletedAt: projects.deletedAt,
      createdAt: projects.createdAt,
      deadlineAt: projects.deadlineAt,
      name: projects.name,
      status: projects.status,
      startAt: projects.startAt,
    } satisfies Record<string, (typeof projects)[keyof typeof projects]>;

    const sortBy = allowedSortFields.includes(
      requestParameters.sortBy as keyof ProjectType
    )
      ? (requestParameters.sortBy as keyof typeof sortColumnMap)
      : "name";

    const sortOrder = requestParameters.sortOrder === "desc" ? desc : asc;
    const sortColumn = sortColumnMap[sortBy];

    const result = await db.query.projects.findMany({
      where: and(...where),
      with: {
        tasks: {
          columns: {
            name: true,
            completedAt: true,
          },
        },
      },
      limit: isNaN(limit) ? 50 : limit,
      offset: isNaN(offset) ? 0 : offset,
      orderBy: [sortOrder(sortColumn)],
    });

    if (!result.length) {
      return createNextResponse(404, {
        message: "Can't find what you're looking for",
        userFriendly: true,
      });
    }

    return createNextResponse(200, {
      message: "Data Found",
      userFriendly: false,
      data: result,
    });
  } catch (error) {
    return createNextResponse(500, {
      message: "Unexpected error, please try again.",
      userFriendly: true,
    });
  }
};
