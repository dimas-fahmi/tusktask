import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";
import type { V1ProjectGetResponse } from "@/app/api/v1/project/get";
import ProjectDetailPageIndex from "./ProjectDetailPageIndex";

const uuid = z.uuid();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const validation = uuid.safeParse(id);

  const projectQuery = validation.success
    ? await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/project?id=${id}`,
        {
          headers: await headers(),
          next: {
            revalidate: 60 * 60 * 12,
            tags: ["project", id],
          },
        },
      )
    : undefined;
  const queryResult = (await projectQuery?.json()) as V1ProjectGetResponse;
  const projectResult = queryResult?.result?.result?.[0];

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
