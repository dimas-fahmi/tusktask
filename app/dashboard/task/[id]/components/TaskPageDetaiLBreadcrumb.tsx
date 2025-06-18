import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/ui/components/shadcn/ui/breadcrumb";
import Link from "next/link";
import { DetailTask } from "@/src/types/task";
import { Skeleton } from "@/src/ui/components/shadcn/ui/skeleton";
import { truncateText } from "@/src/lib/tusktask/utils/truncateText";

const BreadcrumbSkeleton = () => {
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <div className="w-20 h-4 rounded bg-muted animate-pulse" />
        </BreadcrumbItem>
        <Skeleton className="w-2 h-2" />
        <BreadcrumbItem>
          <div className="w-20 h-4 rounded bg-muted animate-pulse" />
        </BreadcrumbItem>
        <Skeleton className="w-2 h-2" />
        <BreadcrumbItem>
          <div className="w-24 h-4 rounded bg-muted animate-pulse" />
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

const TaskPageDetaiLBreadcrumb = ({ task }: { task?: DetailTask }) => {
  return !task ? (
    <BreadcrumbSkeleton />
  ) : (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {/* Dashboard  */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={"/dashboard"}>Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Team */}
        {task?.team && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={`/dashboard/teams/${task?.team?.id}`}
                  title={`Team ${task?.team?.name}`}
                >
                  {truncateText(task?.team?.name ?? "", 2)}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}

        {/* Deeper Parent // Later.... */}

        {/* Parent */}
        {task?.parent && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/dashboard/task/${task?.parent.id}`}>
                  {task?.parent.name}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}

        {/* Current Page */}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{task?.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default TaskPageDetaiLBreadcrumb;
