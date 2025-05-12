import { auth } from "@/auth";
import { db } from "@/src/db";
import { ProjectInsertType, projects } from "@/src/db/schema/projects";
import createNextResponse from "@/src/lib/tusktask/utils/json/createNextResponse";
import { projectSchema } from "@/src/zod/projectSchema";
import { z } from "zod";

// POST handler for creating a new project
export const projectsPost = async (req: Request) => {
  try {
    // Retrieve the current user's session
    const session = await auth();
    const currentUserId = session?.user?.id;

    // Check if the user is authenticated
    if (!currentUserId) {
      return createNextResponse(401, {
        message: "Unauthorized: You must be logged in to create a project",
        userFriendly: true,
        data: null,
      });
    }

    // Parse and validate the request body
    const body = await req.json();
    const validatedData = projectSchema.parse(body);

    // Prepare the project data for insertion
    const newProject: ProjectInsertType = {
      name: validatedData.name,
      description: validatedData.description,
      createdById: currentUserId,
      ownerId: currentUserId,
      estimatedHours: validatedData.estimatedHours,
      estimatedMinutes: validatedData.estimatedMinutes,
      status: validatedData.status,
      visibility: validatedData.visibility,
      startAt: validatedData.startAt
        ? new Date(validatedData.startAt)
        : undefined,
      deadlineAt: validatedData.deadlineAt
        ? new Date(validatedData.deadlineAt)
        : undefined,
      createdAt: new Date(),
    };

    // Insert the new project into the database
    const [createdProject] = await db
      .insert(projects)
      .values(newProject)
      .returning();

    // Return a successful response with the created project
    return createNextResponse(201, {
      message: "Project created successfully",
      userFriendly: true,
      data: createdProject,
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return createNextResponse(400, {
        message:
          "Validation error: " + error.errors.map((e) => e.message).join(", "),
        userFriendly: true,
        data: null,
      });
    }

    // Log the error for debugging purposes
    console.error("Error creating project:", error);

    // Return an error response with a 500 status code
    return createNextResponse(500, {
      message: "An error occurred while creating the project",
      userFriendly: false,
      data: null,
    });
  }
};
