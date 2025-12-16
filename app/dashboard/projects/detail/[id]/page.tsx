import type { Metadata } from "next";
import { redirect } from "next/navigation";
import z from "zod";
import { getProjects } from "@/src/lib/queries/serverQueries/getProjects";
import ProjectDetailPageIndex from "./ProjectDetailPageIndex";

const uuid = z.uuid();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const query = await getProjects({ id }, ["project", `project-${id}`]);
  const projectResult = query?.result?.result?.[0];

  return {
    title: `${projectResult?.name || "Project Not Found"} | TuskTask`,
    description: projectResult?.description || "No description",
  };
}

const ProjectDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const validation = uuid.safeParse(id);

  if (!validation.success) {
    redirect("/dashboard/projects");
  }

  return <ProjectDetailPageIndex id={id} />;
};

export default ProjectDetailPage;
