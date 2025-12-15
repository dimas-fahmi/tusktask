"use client";

import { FolderX } from "lucide-react";
import { redirect } from "next/navigation";
import { authClient } from "@/src/lib/auth/client";
import { useGetSelfProjects } from "@/src/lib/queries/hooks/useGetSelfProjects";
import { useNewProjectDialogStore } from "@/src/lib/stores/newProjectDialog";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/ui/shadcn/components/ui/tooltip";

const EmptyProjectsIndex = () => {
  const { data: session } = authClient.useSession();
  const { data: projectsData, isPending: isLoadingProjects } =
    useGetSelfProjects();
  const projects = projectsData?.result?.result;

  if (!isLoadingProjects && !!projects?.length) {
    redirect("/dashboard");
  }

  const { setOpen } = useNewProjectDialogStore();

  return (
    <div className="min-h-dvh max-h-dvh flex-center">
      {/* Wrapper */}
      <div className="flex flex-col items-center gap-6">
        {/* Icon */}
        <FolderX className="w-10 h-10 opacity-70" />

        {/* body */}
        <div className="text-center space-y-2 max-w-sm">
          <h1 className="text-xl font-semibold">No Projects Found</h1>
          <p className="text-sm font-light opacity-70">{`Let's create a new project, you can read more about projects in the documentation.`}</p>
        </div>

        {/* Footer */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => {
              if (!session) return;
              setOpen(true);
            }}
          >
            Create
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button variant={"outline"} disabled>
                  Documentation
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>Still under construction</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default EmptyProjectsIndex;
