import { auth } from "@/auth";
import { db } from "@/src/db";
import { projects } from "@/src/db/schema/projects";
import { eq } from "drizzle-orm";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const [result] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    return {
      title: `${result.name} | Project`,
    };
  } catch (error) {
    return {
      title: "ERROR | FAILED TO FETCH PROJECT",
    };
  }
}

const ProjectPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <div>ProjectPage {id}</div>;
};

export default ProjectPage;
