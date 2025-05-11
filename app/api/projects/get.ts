import { or, eq, and, isNull, inArray } from "drizzle-orm";
import createNextResponse from "@/src/lib/tusktask/utils/json/createNextResponse";
import { auth } from "@/auth";
import { projects, projectsToUsers } from "@/src/db/schema/projects";
import { db } from "@/src/db";

export const ProjectsGet = async (req: Request) => {
  try {
    // Retrieve the current user's session (adjust based on your authentication method)
    const session = await auth();
    const currentUserId = session?.user?.id;

    let query;

    if (currentUserId) {
      // Subquery to get project IDs where the user is associated via projectsToUsers
      const userProjectsSubquery = db
        .select({ projectId: projectsToUsers.projectId })
        .from(projectsToUsers)
        .where(eq(projectsToUsers.userId, currentUserId));

      // Query for authenticated users: public projects, owned projects, or associated projects
      query = db
        .select()
        .from(projects)
        .where(
          and(
            or(
              eq(projects.visibility, "public"), // Public projects
              eq(projects.ownerId, currentUserId), // Projects owned by the user
              inArray(projects.id, userProjectsSubquery) // Projects user is associated with
            ),
            isNull(projects.deletedAt) // Exclude deleted projects
          )
        );
    } else {
      // Query for unauthenticated users: only public projects
      query = db
        .select()
        .from(projects)
        .where(
          and(eq(projects.visibility, "public"), isNull(projects.deletedAt))
        );
    }

    // Execute the query to fetch the projects
    const projectsList = await query;

    // Return a successful response with the projects data
    return createNextResponse(200, {
      message: "Projects fetched successfully",
      userFriendly: true,
      data: projectsList,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching projects:", error);

    // Return an error response with a 500 status code
    return createNextResponse(500, {
      message: "An error occurred while fetching projects",
      userFriendly: false,
      data: null,
    });
  }
};
