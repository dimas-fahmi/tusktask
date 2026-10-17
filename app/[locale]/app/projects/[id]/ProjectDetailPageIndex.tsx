"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useTRPC } from "@/src/lib/trpc/client/client";
import { Skeleton } from "@/src/ui/shadcn/components/ui/skeleton";
import ProjectKanbanLayout from "./KanbanLayout/ProjectKanbanLayout";
import ProjectListLayout from "./ListLayout/ProjectListLayout";

const ProjectDetailPageIndex = () => {
  const { id } = useParams<{ id: string }>();

  const trpc = useTRPC();

  const { data, isPending } = useQuery({
    ...trpc.project.getProjectDetail.queryOptions({ id }),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="space-y-2">
        {isPending ? (
          <Skeleton className="h-9 w-48" />
        ) : (
          <h1 className="text-3xl font-semibold">{data?.name ?? "Untitled"}</h1>
        )}

        {isPending ? (
          <Skeleton className="h-4 w-60" />
        ) : data?.description ? (
          <p className="text-sm font-light">{data?.description}</p>
        ) : (
          <p className="opacity-70 text-sm font-light">No Description</p>
        )}
      </header>

      {data ? (
        data?.viewLayout === "kanban" ? (
          <ProjectKanbanLayout data={data} />
        ) : (
          <ProjectListLayout data={data} />
        )
      ) : (
        // TODO: Use Proper Loader
        <Skeleton className="w-full h-72" />
      )}
    </div>
  );
};

export default ProjectDetailPageIndex;
