"use client";

import { Skeleton } from "@/src/ui/shadcn/components/ui/skeleton";
import React from "react";
import RenderLucide from "../../RenderLucide";
import { ProjectApp } from "@/src/lib/types/projects";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/src/ui/shadcn/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/ui/shadcn/components/ui/tooltip";
import ProjectCardContextMenu from "./ProjectCardContextMenu";
import { Task } from "@/src/db/schema/tasks";
import { compactNumber } from "@/src/lib/utils/compactNumber";
import Link from "next/link";

export const ProjectCardSkeleton = () => {
  return (
    <div className="relative p-4 min-h-34 max-h-34 min-w-48 max-w-48 cursor-pointer border text-nowrap rounded-md shadow-sm text-sm overflow-hidden animate-pulse">
      {/* header */}
      <header className="space-y-2 mb-4">
        <Skeleton className="h-6 w-3/4 rounded-md" /> {/* Simulated title */}
        <Skeleton className="h-4 w-1/2 rounded-md" /> {/* Simulated label */}
      </header>

      {/* Icon placeholder */}
      <Skeleton className="absolute -bottom-5 -right-5 w-24 h-24 opacity-30 rounded-full" />
    </div>
  );
};

export const ProjectCard = ({
  project,
}: {
  project: ProjectApp & { tasks: Task[] };
  iconName?: string | null;
}) => {
  const icon = project?.icon || "File";

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Link
          href={`/dashboard/projects/${project?.id}`}
          className={`${project?.isPending ? "animate-pulse cursor-wait glowing-card pointer-events-none" : "hover:scale-[1.05] hover:mx-2 hover:bg-primary hover:text-primary-foreground"} relative min-h-34 max-h-34 min-w-48 max-w-48 border text-nowrap rounded-md p-[1px] shadow-sm text-sm overflow-hidden transition-all duration-300`}
        >
          <div className="bg-background p-4 h-full rounded-md cursor-pointer transition-all duration-300 hover:border-transparent group/card z-10 hover:bg-primary hover:text-primary-foreground">
            {/* header */}
            <header>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h1 className="font-header group-hover/card:opacity-100 transition-all duration-300 text-xl opacity-50 truncate">
                    {project?.name || "Untitled"}
                  </h1>
                </TooltipTrigger>
                <TooltipContent>{project?.name || "Untitled"}</TooltipContent>
              </Tooltip>

              <p className="text-sm opacity-50 font-body group-hover/card:opacity-75 transition-all duration-300">
                {Array.isArray(project?.tasks) && project?.tasks?.length
                  ? compactNumber(project?.tasks?.length)
                  : "No"}{" "}
                Tasks
              </p>
            </header>
            {/* Icon */}
            <RenderLucide
              iconName={icon}
              className="absolute group-hover/card:opacity-100 transition-all duration-300 -bottom-5 -right-5 w-24 h-24 opacity-30"
            />
          </div>
        </Link>
      </ContextMenuTrigger>
      <ContextMenuContent className="min-w-52">
        <ProjectCardContextMenu project={project} />
      </ContextMenuContent>
    </ContextMenu>
  );
};
