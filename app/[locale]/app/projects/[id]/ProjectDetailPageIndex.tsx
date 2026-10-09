"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useTRPC } from "@/src/lib/trpc/client/client";
import ProjectKanbanLayout from "./KanbanLayout/ProjectKanbanLayout";
import ProjectListLayout from "./ListLayout/ProjectListLayout";

const ProjectDetailPageIndex = () => {
  const { id } = useParams<{ id: string }>();

  const trpc = useTRPC();
  const { data } = useQuery({
    ...trpc.project.getProjectDetail.queryOptions({ id }),
  });

  return data?.viewLayout === "kanban" ? (
    <ProjectKanbanLayout data={data} />
  ) : (
    <ProjectListLayout data={data} />
  );
};

export default ProjectDetailPageIndex;
