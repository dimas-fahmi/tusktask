import { or, eq, and, isNotNull, exists } from "drizzle-orm";
import createNextResponse from "@/src/lib/tusktask/utils/json/createNextResponse";
import { auth } from "@/auth";
import {
  projects,
  projectsToUsers,
  ProjectType,
} from "@/src/db/schema/projects";
import { db } from "@/src/db";
import { getSearchParams } from "@/src/lib/tusktask/utils/url/getSearchParams";
import { tasks } from "@/src/db/schema/tasks";

export interface ProjectsGetRequest {
  completedAt?: boolean;
  withTask?: boolean; // default false
  limit?: number; // default 50
  offset?: number; // default 0
}

// Interface for the data array elements in the response
export interface ProjectsGetResponseData extends ProjectType {
  tasks?: Array<{
    name: string;
    completedAt: Date | null;
  }>;
}

export const ProjectsGet = async (req: Request) => {
  const url = new URL(req.url);
  const requestParameters: ProjectsGetRequest = getSearchParams(url, [
    "limit",
    "offset",
    "withTask",
    "completedAt",
  ]);

  // Set default values
  const limit = requestParameters.limit ?? 50;
  const offset = requestParameters.offset ?? 0;
  const withTask = requestParameters.withTask ?? false;
  const completedAtFilter = requestParameters.completedAt ?? false;

  // Session Authentication
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return createNextResponse(401, {
      message: "Invalid session, please log out and log back in",
      userFriendly: false,
    });
  }

  const userId = session.user.id;

  // Filter States
  let where = [];
  let withRelations: Record<string, any> = {};

  // Project filter: user is owner or associated via projectsToUsers
  const projectFilter = or(
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
  where.push(projectFilter);

  // Filter projects with completed tasks if completedAt is true
  if (completedAtFilter) {
    const completedTasksSubquery = db
      .select()
      .from(tasks)
      .where(
        and(eq(tasks.projectId, projects.id), isNotNull(tasks.completedAt))
      );
    where.push(exists(completedTasksSubquery));
  }

  // Include tasks if withTask is true
  if (withTask) {
    withRelations.tasks = {
      columns: {
        name: true,
        completedAt: true,
      },
    };
  }

  // Fetching
  try {
    const response = await db.query.projects.findMany({
      where: and(...where),
      with: withRelations,
      limit,
      offset,
    });

    return createNextResponse(200, {
      message: "Projects fetched successfully",
      userFriendly: true,
      data: response,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return createNextResponse(500, {
      message: "An error occurred while fetching projects",
      userFriendly: false,
    });
  }
};
