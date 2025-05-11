import { Button } from "@/src/ui/components/shadcn/ui/button";
import { CirclePlus, Folder, MessageCircleMore } from "lucide-react";
import React from "react";

const ProjectsPageIndex = () => {
  return (
    <div>
      {" "}
      <header className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold text-tt-primary-foreground/80">
            <Folder size={"2rem"} />
            Projects
          </h1>
          <Button>
            <CirclePlus className="hidden md:inline" />
            New Task
          </Button>
        </div>
        <p className="flex text-sm text-muted-foreground items-center gap-2">
          <MessageCircleMore size={"1rem"} />
          Here is your projects page, organize tasks by grouping them with
          projects!
        </p>
      </header>
    </div>
  );
};

export default ProjectsPageIndex;
