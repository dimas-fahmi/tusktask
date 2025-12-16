"use client";

import { CirclePlus, FunnelX, Search } from "lucide-react";
import { useGetSelfProjects } from "@/src/lib/queries/hooks/useGetSelfProjects";
import { useNewProjectDialogStore } from "@/src/lib/stores/newProjectDialog";
import ProjectCard from "@/src/ui/components/ui/ProjectCard";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const ProjectsPageIndex = () => {
  const { data: projectData } = useGetSelfProjects();
  const projects = projectData?.result?.result;

  const { setOpen: setNewProjectDialogOpen } = useNewProjectDialogStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <div>
          <h1 className="text-4xl font-semibold">Projects</h1>
          <p className="text-sm font-light opacity-70">
            Keep your tasks organized by using projects; you can see all the
            projects you're involved in on this page.
          </p>
        </div>
      </header>

      {/* Controller */}
      <div className="flex justify-between items-center">
        <Button variant={"outline"} size={"sm"} disabled>
          <FunnelX className="w-4 h-4" /> Reset
        </Button>

        <div className="flex items-center gap-2">
          <Button variant={"outline"} size={"sm"} disabled>
            <Search className="w-4 h-4" />
          </Button>
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => {
              setNewProjectDialogOpen(true);
            }}
          >
            <CirclePlus className="w-4 h-4" /> New Project
          </Button>
        </div>
      </div>

      {/* Project Collection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects &&
          Array.isArray(projects) &&
          projects.map((project) => (
            <ProjectCard
              key={project?.id || crypto.randomUUID()}
              project={project}
            />
          ))}
      </div>
    </div>
  );
};

export default ProjectsPageIndex;
