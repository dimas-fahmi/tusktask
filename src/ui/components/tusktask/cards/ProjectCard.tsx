import {
  Archive,
  Circle,
  CircleCheckBig,
  CircleDashed,
  CirclePlus,
  Ellipsis,
  ExternalLink,
  Folder,
  LucideIcon,
  Trash,
} from "lucide-react";
import React from "react";
import { Separator } from "../../shadcn/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../shadcn/ui/popover";
import { ProjectsGetResponseData } from "@/app/api/projects/get";
import { useRouter } from "next/navigation";

export const ProjectCardPopoverButton = ({
  Icon,
  text,
  onClick,
}: {
  Icon: LucideIcon;
  text: string;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-sm cursor-pointer bg-tt-primary hover:bg-tt-muted px-4 py-2 text-tt-primary-foreground/70 hover:text-tt-primary-foreground"
    >
      <Icon className="w-4 h-4" />
      {text}
    </button>
  );
};

const ProjectCard = ({ projects }: { projects: ProjectsGetResponseData }) => {
  // Destructure Required Value
  const { name, description, tasks, id } = projects;

  // Initialize Router
  const router = useRouter();

  // Task Counter Data
  const total_tasks = tasks ? tasks.length : 0;
  const ongoing_tasks = tasks
    ? tasks.filter((task) => !task.completedAt).length
    : 0;
  const completed_tasks = tasks
    ? tasks.filter((task) => task.completedAt).length
    : 0;

  return (
    <div className="border shadow-xl max-w-[380px] rounded-xl">
      <header className="p-4">
        <h1 className="flex items-center gap-1.5 font-primary text-xl justify-between">
          <span>{name}</span>
          <button
            className="opacity-20 cursor-pointer hover:opacity-100 transition-all duration-300"
            title="Open Project"
            onClick={() => {
              router.push(`/dashboard/projects/${id}`);
            }}
          >
            <ExternalLink />
          </button>
        </h1>
        <p className="text-xs text-tt-primary-foreground/70 mt-2 min-h-[80px] max-h-[80px]">
          {description ? description : "No Description"}
        </p>
      </header>
      <Separator />
      <footer className="flex justify-between items-center text-xs">
        <div className="flex gap-2 ps-2">
          <div className="flex gap-2">
            <span className="px-2 md:px-1 py-2 text-center flex items-center gap-1">
              <CircleDashed className="w-3 h-3" /> {total_tasks}
            </span>
            <Separator orientation="vertical" />
          </div>
          <div className="flex gap-2">
            <span className="px-2 md:px-1 py-2 text-center flex items-center gap-1">
              <Circle className="w-3 h-3" /> {ongoing_tasks}
            </span>
            <Separator orientation="vertical" />
          </div>
          <div className="flex gap-2">
            <span className="px-2 md:px-1 py-2 text-center flex items-center gap-1">
              <CircleCheckBig className="w-3 h-3" /> {completed_tasks}
            </span>
            <Separator orientation="vertical" />
          </div>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <button className="px-3 opacity-50 hover:opacity-100 cursor-pointer">
              <Ellipsis />
            </button>
          </PopoverTrigger>
          <PopoverContent className="grid grid-cols-1 px-0 py-1">
            <ProjectCardPopoverButton
              Icon={ExternalLink}
              text="Open Project"
              onClick={() => {
                router.push(`/dashboard/projects/${id}`);
              }}
            />
            <Separator />
            <ProjectCardPopoverButton Icon={CirclePlus} text="New Task" />
            <Separator />
            <ProjectCardPopoverButton Icon={Archive} text="Archive Project" />
            <ProjectCardPopoverButton Icon={Trash} text="Delete Project" />
          </PopoverContent>
        </Popover>
      </footer>
    </div>
  );
};

export default ProjectCard;
