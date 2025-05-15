import React from "react";
import TaskCheckButton from "../buttons/TaskCheckButton";
import {
  Archive,
  Circle,
  CircleAlert,
  CirclePlus,
  ClockAlert,
  Ellipsis,
  ExternalLink,
  Pencil,
  Send,
  Trash,
} from "lucide-react";
import { Button } from "../../shadcn/ui/button";
import { TasksGetApiData } from "@/app/api/tasks/types";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../shadcn/ui/popover";
import { ProjectCardPopoverButton } from "../cards/ProjectCard";
import { Separator } from "../../shadcn/ui/separator";
import StatusOverviewCard from "../cards/StatusOverviewCard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../shadcn/ui/tooltip";

const TaskCard = ({ data }: { data: TasksGetApiData[] }) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1">
      {data.map((subTask) => (
        <div
          key={subTask.id}
          className={`group/stc p-2 text-tt-muted-foreground flex items-center justify-between hover:bg-tt-muted/20 rounded-md cursor-pointer ${subTask.createdByOptimisticUpdate && "cursor-wait animate-pulse"}`}
        >
          <div className="flex items-center gap-1.5">
            <TaskCheckButton
              taskId={subTask.id}
              completedAt={subTask.completedAt}
              createdByOptimisticUpdate={
                subTask.createdByOptimisticUpdate ?? false
              }
              prevent={
                subTask.subTasks &&
                subTask.subTasks.filter((task) => task.status === "completed")
                  .length !== subTask.subTasks.length
              }
              preventMessage="You have to finish all sub-tasks of this task before you can mark this task completed!"
              preventTitle="You can't do this yet"
            />
            <span className="text-sm capitalize">{subTask.name}</span>
          </div>
          <div className="flex opacity-50 group-hover/stc:opacity-100 gap-0.5">
            <TooltipProvider>
              <Tooltip defaultOpen={false}>
                <TooltipTrigger>
                  <span className="text-xs px-3 opacity-50 hover:opacity-100 cursor-pointer">
                    {subTask.subTasks &&
                      subTask.subTasks.length > 0 &&
                      `${subTask.subTasks.filter((task) => task.status === "completed").length}/${subTask.subTasks.length}`}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <span className="text-xs px-4 mb-2">
                    You have to complete all sub-tasks before you can mark this
                    task completed
                  </span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Popover>
              <PopoverTrigger asChild>
                <button className="px-3 opacity-50 hover:opacity-100 cursor-pointer">
                  <Ellipsis />
                </button>
              </PopoverTrigger>
              <PopoverContent className="grid grid-cols-1 px-0 py-1">
                {subTask.subTasks && subTask.subTasks.length > 0 && (
                  <div>
                    <h4 className="px-4 pt-2 font-semibold flex items-center gap-1.5">
                      <TooltipProvider>
                        <Tooltip defaultOpen={false}>
                          <TooltipTrigger>
                            <CircleAlert className="w-4 h-4 opacity-60" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <span className="text-xs px-4 mb-2">
                              You need to finish all sub-tasks before you can
                              mark this task completed
                            </span>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <span>Sub-Tasks Overview</span>
                    </h4>
                    <div className="px-4 py-2 grid grid-cols-3 gap-2">
                      <StatusOverviewCard
                        title="Sub-Tasks"
                        number={subTask.subTasks && subTask.subTasks.length}
                        icon={ClockAlert}
                      />
                      <StatusOverviewCard
                        title="Completed"
                        number={
                          subTask.subTasks &&
                          subTask.subTasks.filter((task) => task.completedAt)
                            .length
                        }
                        icon={ClockAlert}
                      />
                      <StatusOverviewCard
                        title="Today"
                        number={
                          subTask.subTasks &&
                          subTask.subTasks.filter(
                            (task) => task.status !== "completed"
                          ).length
                        }
                        icon={Circle}
                      />
                    </div>
                    <Separator />
                  </div>
                )}

                <ProjectCardPopoverButton
                  Icon={ExternalLink}
                  text="Open Task"
                  onClick={() => {
                    router.push(`/dashboard/task/${subTask.id}`);
                  }}
                />

                <Separator />
                {subTask.status !== "completed" && (
                  <>
                    <ProjectCardPopoverButton
                      Icon={Send}
                      text="Say You're On It"
                    />
                    <Separator />
                  </>
                )}

                <ProjectCardPopoverButton Icon={Archive} text="Archive Task" />
                <Separator />
                <ProjectCardPopoverButton Icon={Trash} text="Delete Task" />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskCard;
