"use client";

import { ProjectsGetResponseData } from "@/app/api/projects/get";
import useTasksContext from "@/src/lib/tusktask/hooks/context/useTasksContext";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import ProjectCard from "@/src/ui/components/tusktask/cards/ProjectCard";
import { CirclePlus, Folder, MessageCircleMore } from "lucide-react";
import React from "react";

const ProjectsPageIndex = () => {
  // Pull setters from task context
  const { newProjectDialogOpen, setNewProjectDialogOpen } = useTasksContext();

  // Pull data, setters and states from task context
  const { projects } = useTasksContext();

  // Projects data
  const projectsData =
    projects && Array.isArray(projects.data)
      ? (projects.data as ProjectsGetResponseData[])
      : null;

  return (
    <div>
      <header className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold text-tt-primary-foreground/80">
            <Folder size={"2rem"} />
            Projects
          </h1>
          <Button onClick={() => setNewProjectDialogOpen(true)}>
            <CirclePlus className="hidden md:inline" />
            New Project
          </Button>
        </div>
        <p className="flex text-sm text-muted-foreground items-center gap-2">
          <MessageCircleMore size={"1rem"} />
          Here is your projects page, organize tasks by grouping them with
          projects!
        </p>
      </header>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {projectsData &&
          projectsData.map((project) => (
            <ProjectCard key={project.id} projects={project} />
          ))}
      </div>
    </div>
  );
};

export default ProjectsPageIndex;
