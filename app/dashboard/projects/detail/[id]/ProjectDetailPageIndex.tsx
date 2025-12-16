"use client";

import { useGetSelfProjects } from "@/src/lib/queries/hooks/useGetSelfProjects";
import TaskCard from "@/src/ui/components/ui/TaskCard";
import Sidebar from "./components/Sidebar";

const ProjectDetailPageIndex = ({ id }: { id: string }) => {
  const { data: projectQuery } = useGetSelfProjects({ id });
  const project = projectQuery?.result?.result?.[0];

  return (
    <div className="space-y-12">
      {/* Upper Section */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-[auto_280px]">
        {/* Header */}
        <header>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold">{project?.name}</h1>
            <p className="text-sm font-light opacity-70">
              {project?.description || "No description"}
            </p>
          </div>
        </header>

        {/* Sidebar */}
        <Sidebar project={project} />
      </section>

      {/* Tasks */}
      <div className="space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-4xl font-semibold">Tasks Collections</h1>
          <p className="text-sm font-light opacity-70">
            This project's tasks collections
          </p>
        </header>

        {/* Task Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TaskCard />
          <TaskCard />
          <TaskCard />
          <TaskCard />
          <TaskCard />
          <TaskCard />
          <TaskCard />
          <TaskCard />
          <TaskCard />
          <TaskCard />
          <TaskCard />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPageIndex;
