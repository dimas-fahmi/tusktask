"use client";

import { UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ExtendedProjectType } from "@/src/lib/app/app";
import { authClient } from "@/src/lib/auth/client";
import { truncateString } from "@/src/lib/utils/truncateString";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "@/src/ui/shadcn/components/ui/context-menu";
import ProjectCardContextMenu from "./ProjectCardContextMenu";

const ProjectCard = ({ project }: { project?: ExtendedProjectType }) => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const memberships = project?.memberships;
  const membership = project?.memberships?.find((m) => m.userId === user?.id);

  const router = useRouter();

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          type="button"
          className="p-4 border flex flex-col gap-1 rounded-lg min-h-38 max-h-38 text-left transition-all duration-300 group/card cursor-pointer
          not-disabled:hover:scale-95 not-disabled:active:scale-90
          "
          disabled={!project?.id}
          onClick={() => {
            if (!project?.id) return;
            router.push(`/dashboard/projects/detail/${project?.id}`);
          }}
        >
          <h1>{project?.name || "Untitled Project"}</h1>
          <p className="text-xs flex-1 font-light opacity-70">
            {project?.description
              ? truncateString(project.description, 14, true)
              : "No description"}
          </p>
          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* Role */}
            <span className="p-2 rounded-lg border text-xs font-light opacity-70 capitalize">
              {membership?.type || "Unknown role"}
            </span>

            {/* Total Member */}
            <span className="p-2 rounded-lg flex items-center gap-0.5 border text-xs font-light opacity-70 capitalize">
              <UsersRound className="w-3 h-3" />
              {memberships?.length}
            </span>
          </div>
        </button>
      </ContextMenuTrigger>

      <ProjectCardContextMenu />
    </ContextMenu>
  );
};

export default ProjectCard;
