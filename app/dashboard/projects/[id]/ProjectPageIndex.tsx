"use client";

import { SpecificProjectGetData } from "@/app/api/projects/[id]/route";
import { fetchSpecificProject } from "@/src/lib/tusktask/fetchers/fetchSpecificProject";
import { useQuery } from "@tanstack/react-query";
import { MessageCircleMore } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ProjectPageIndex = ({ id }: { id: string }) => {
  // Initialize query
  const { data, isFetched, isFetching } = useQuery({
    queryKey: ["projects", id],
    queryFn: () => {
      return fetchSpecificProject(id);
    },
    enabled: !!id,
  });

  const projectData =
    data && data.data ? (data.data as SpecificProjectGetData) : null;

  const router = useRouter();

  useEffect(() => {
    if (isFetched && !isFetching && !projectData) {
      router.push("/404");
    }
  }, [projectData, isFetched, isFetching]);

  return (
    <div>
      <header className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold text-tt-primary-foreground/80">
            {projectData?.name}
          </h1>
        </div>
        <p className="flex text-sm text-muted-foreground items-center gap-2">
          <MessageCircleMore size={"1rem"} />
          {projectData?.description}
        </p>
      </header>
    </div>
  );
};

export default ProjectPageIndex;
