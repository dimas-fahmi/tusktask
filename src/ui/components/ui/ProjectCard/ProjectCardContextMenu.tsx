"use client";

import Link from "next/link";
import type { ExtendedProjectType } from "@/src/lib/app/app";
import {
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/src/ui/shadcn/components/ui/context-menu";

const ProjectCardContextMenu = ({
  project,
}: {
  project?: ExtendedProjectType;
}) => {
  return (
    <ContextMenuContent className="min-w-52 max-w-52">
      {/* Top Level */}
      <ContextMenuItem
        inset
        disabled={!project?.id || project?.isPending}
        asChild
      >
        <Link href={`/dashboard/projects/${project?.id}`}>Open</Link>
      </ContextMenuItem>

      {/* Memberships */}
      <ContextMenuSeparator />

      {/* Category Level */}
      <ContextMenuSeparator />
      <ContextMenuCheckboxItem>Archived</ContextMenuCheckboxItem>
      <ContextMenuCheckboxItem>Pinned</ContextMenuCheckboxItem>

      {/* Advance Level */}
      <ContextMenuSeparator />
      <ContextMenuItem inset variant="destructive">
        Delete
      </ContextMenuItem>
    </ContextMenuContent>
  );
};

export default ProjectCardContextMenu;
