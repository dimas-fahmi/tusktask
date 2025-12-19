import type { Metadata } from "next";
import { getProjects } from "@/src/lib/queries/serverQueries/getProjects";
import ProjectLogPageIndex from "./ProjectLogPageIndex";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const projectQuery = await getProjects({ id }, ["project", `project-${id}`]);
  const project = projectQuery?.result?.result?.[0];

  return {
    title: `${project?.name || "Untitled"} | TuskTask`,
  };
}

const ProjectLogPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const projectQuery = await getProjects({ id }, ["project", `project-${id}`]);
  const project = projectQuery?.result?.result?.[0];

  return (
    <div className="space-y-6">
      <header>
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold">{project?.name}</h1>
          <p className="text-sm font-light opacity-70">
            Review everything that happened in this project for the last 30 days
          </p>
        </div>
      </header>

      <ProjectLogPageIndex id={id} />
    </div>
  );
};

export default ProjectLogPage;
