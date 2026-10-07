import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getEnv } from "@/src/app/env";
import route from "@/src/app/route";
import { SEARCH_PARAMS } from "@/src/app/searchParams";
import { etm, protoValidator } from "@/src/i18n/errorTranslation/init";
import { serverGetQueryClient, serverTRPC } from "@/src/lib/trpc/server/caller";
import ProjectDetailPageIndex from "./ProjectDetailPageIndex";

const getProjectById = cache(async (id: string) => {
  const queryClient = serverGetQueryClient();
  const data = await queryClient
    .query({
      ...serverTRPC.project.getProjectDetail.queryOptions({
        id,
      }),
    })
    .catch((err) => {
      const isTranslateable = protoValidator(err?.message);
      const url = new URL(route.myProjects(), getEnv("NEXT_PUBLIC_APP_URL"));
      url.searchParams.append(
        SEARCH_PARAMS.toast.err.key,
        isTranslateable ? err?.message : etm.unknown_error.construct(),
      );
      redirect(url.toString());
    });

  return { queryClient, data };
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getProjectById(id);

  return {
    title: `${data?.name} | ${getEnv("NEXT_PUBLIC_APP_NAME")}`,
  };
}

const ProjectPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const { queryClient } = await getProjectById(id);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectDetailPageIndex />
    </HydrationBoundary>
  );
};

export default ProjectPage;
