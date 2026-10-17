import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cache, Suspense } from "react";
import { getEnv } from "@/src/app/env";
import { isErrorObjectWithMessage } from "@/src/app/error";
import route from "@/src/app/route";
import { SEARCH_PARAMS } from "@/src/app/searchParams";
import { etm, protoValidator } from "@/src/i18n/errorTranslation/init";
import { serverGetQueryClient, serverTRPC } from "@/src/lib/trpc/server/caller";
import { Skeleton } from "@/src/ui/shadcn/components/ui/skeleton";
import ProjectDetailPageIndex from "./ProjectDetailPageIndex";

const getProjectById = cache(async (id: string) => {
  const queryClient = serverGetQueryClient();

  let error: unknown = null;

  const data = await queryClient
    .query({
      ...serverTRPC.project.getProjectDetail.queryOptions({
        id,
      }),
    })
    .catch((err) => {
      error = err;
      console.error("Error fetching project detail for", {
        err,
        id,
      });
    });

  if (error && !data) {
    const isTranslateable = isErrorObjectWithMessage(error)
      ? protoValidator(error.message)
      : false;

    const url = new URL(route.myProjects(), getEnv("NEXT_PUBLIC_APP_URL"));

    url.searchParams.append(
      SEARCH_PARAMS.toast.err.key,
      isTranslateable && isErrorObjectWithMessage(error)
        ? error.message
        : etm.project_not_found.construct(),
    );

    redirect(url.toString());
  }

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

const PageSkeleton = () => {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-78" />
      </header>

      {/* TODO: Proper loading skeleton for body */}
      <Skeleton className="h-78 w-full" />
    </div>
  );
};

const ProjectPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const { queryClient } = await getProjectById(id);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<PageSkeleton />}>
        <ProjectDetailPageIndex />
      </Suspense>
    </HydrationBoundary>
  );
};

export default ProjectPage;
