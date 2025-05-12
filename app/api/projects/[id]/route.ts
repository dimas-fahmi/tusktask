import { auth } from "@/auth";
import { db } from "@/src/db";
import { projects, ProjectType } from "@/src/db/schema/projects";
import { TaskType } from "@/src/db/schema/tasks";
import createNextResponse from "@/src/lib/tusktask/utils/json/createNextResponse";
import { eq } from "drizzle-orm";

export interface SpecificProjectGetData extends ProjectType {
  tasks: TaskType[];
  user: { id: string; name: string; username: string; image: string }[];
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user.id) {
    return createNextResponse(401, {
      message: "Invalid session. Please log out and log back in.",
      userFriendly: true,
    });
  }

  try {
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, id),
      with: {
        projectsToUsers: {
          columns: {},
          with: {
            user: {
              columns: {
                id: true,
                name: true,
                userName: true,
                image: true,
              },
            },
          },
        },
        tasks: {},
      },
    });

    if (!project) {
      return createNextResponse(404, {
        message: "Project not found.",
        userFriendly: true,
      });
    }

    const isOwner = project.ownerId === session.user.id;
    const isAssigned = project.projectsToUsers.some(
      (ptu) => ptu.user.id === session.user.id
    );

    if (!isOwner && !isAssigned) {
      return createNextResponse(403, {
        message: "You don't have permission to access this project.",
        userFriendly: true,
      });
    }

    const { projectsToUsers: ptu, ...projectData } = project;

    const transformedProject = {
      ...projectData,
      users: ptu.map((ptuItem) => ptuItem.user),
    };

    return createNextResponse(200, {
      message: "Project retrieved successfully.",
      userFriendly: false,
      data: transformedProject,
    });
  } catch (error) {
    return createNextResponse(500, {
      message: "An error occurred while retrieving the project.",
      userFriendly: true,
    });
  }
}
