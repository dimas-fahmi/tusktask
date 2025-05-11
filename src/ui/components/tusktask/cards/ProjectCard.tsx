import { Ellipsis, Folder } from "lucide-react";
import React from "react";
import { Separator } from "../../shadcn/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../shadcn/ui/popover";
import { ProjectType } from "@/src/db/schema/projects";

const ProjectCard = ({ projects }: { projects: ProjectType }) => {
  const { name, description } = projects;

  return (
    <div className="border shadow-xl max-w-[380px] rounded-xl">
      <header className="p-4">
        <h1 className="flex items-center gap-1.5 font-primary text-xl">
          <Folder />
          {name}
        </h1>
        <p className="text-xs text-tt-primary-foreground/70 mt-2 min-h-[80px] max-h-[80px]">
          {description ? description : "No Description"}
        </p>
      </header>
      <Separator />
      <footer className="flex justify-between items-center text-xs">
        <div className="flex gap-2 ps-2">
          <div className="flex gap-2">
            <span className="px-2 md:px-1 py-2 text-center">5 Task</span>
            <Separator orientation="vertical" />
          </div>
          <div className="flex gap-2">
            <span className="px-2 md:px-1 py-2 text-center">3 Ongoing</span>
            <Separator orientation="vertical" />
          </div>
          <div className="flex gap-2">
            <span className="px-2 md:px-1 py-2 text-center">2 Completed</span>
            <Separator orientation="vertical" />
          </div>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <button className="px-3 opacity-50 hover:opacity-100 cursor-pointer">
              <Ellipsis />
            </button>
          </PopoverTrigger>
          <PopoverContent>Popover Placeholder, SOON!</PopoverContent>
        </Popover>
      </footer>
    </div>
  );
};

export default ProjectCard;
