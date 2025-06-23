import React from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/ui/components/shadcn/ui/breadcrumb";
import Link from "next/link";
import { DetailTask, ParentType } from "@/src/types/task";
import { Skeleton } from "@/src/ui/components/shadcn/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/ui/components/shadcn/ui/popover";
import PopoverAction from "@/src/ui/components/tusktask/prefabs/Popover/PopoverAction";
import { FolderTree } from "lucide-react";
import { useRouter } from "next/navigation";

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

const NestedPopover = ({ data }: { data: ParentType }) => {
  const popovers = [];
  let current = data;

  const router = useRouter();

  while (current?.parent) {
    const id = current?.parent?.id ?? crypto.randomUUID();
    const url = `/dashboard/task/${id}`;
    const title = current?.parent?.name ?? "N/A";
    popovers.push(
      <PopoverAction
        key={id}
        Icon={FolderTree}
        title={title}
        onClick={() => {
          if (!id) {
            return;
          }
          router.push(url);
        }}
      />
    );
    current = current.parent as ParentType;
  }

  return <>{popovers}</>;
};

const TaskPageDetailBreadcrumb = ({ task }: { task?: DetailTask }) => {
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

        {/* Deeper Parent // Later.... */}
        {task?.parent?.parent && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Popover>
                <PopoverTrigger asChild>
                  <BreadcrumbEllipsis className="cursor-pointer hover:opacity-60 active:opacity-100" />
                </PopoverTrigger>
                <PopoverContent className="!p-1 space-y-3">
                  <NestedPopover data={task?.parent} />
                </PopoverContent>
              </Popover>
            </BreadcrumbItem>
          </>
        )}

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

export default TaskPageDetailBreadcrumb;
