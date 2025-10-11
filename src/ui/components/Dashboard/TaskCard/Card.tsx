"use client";

import React from "react";
import CircularProgress from "../CircularProgress";
import { Clock } from "lucide-react";
import { TaskCardProps } from ".";
import { formatDate, formatDistance } from "date-fns";
import { useRouter } from "next/navigation";
import TaskScratchButton from "../TaskScratchButton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/ui/shadcn/components/ui/tooltip";
import { cn } from "@/src/ui/shadcn/lib/utils";

const Card = React.forwardRef<HTMLDivElement, TaskCardProps>(
  ({ task, ...props }, ref) => {
    const router = useRouter();

    return (
      <div
        onClick={() => {
          router.push(`/dashboard/tasks/detail/${task?.id}`);
        }}
        ref={ref}
        className={cn(
          `${task?.completedAt ? "bg-primary text-primary-foreground" : ""} group/card border min-h-37 max-h-48 p-4 rounded-md cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200 flex flex-col`
        )}
        {...props}
      >
        {/* Priority */}
        <div className="text-xs mb-2 flex items-center justify-between">
          <div className="px-2 py-1 bg-accent text-accent-foreground rounded-full capitalize">
            {task?.taskPriority}
          </div>

          {/* Complete Button */}
          <TaskScratchButton task={task} />
        </div>

        {/* Name */}
        <div className="flex items-center justify-between">
          {/* Task Name */}
          <Tooltip>
            <TooltipTrigger asChild>
              <h2 className="font-header font-semibold line-clamp-1">
                {task?.name}
              </h2>
            </TooltipTrigger>
            <TooltipContent>{task?.name}</TooltipContent>
          </Tooltip>
        </div>

        {/* Details */}
        <div className="text-xs flex flex-1">
          {/* Descriptions & Deadline */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Description */}
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="overflow-hidden font-body opacity-70 line-clamp-2 flex-1">
                  {task?.description || "No description"}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                {task?.description || "No description"}
              </TooltipContent>
            </Tooltip>

            {/* Deadline */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 mt-10 w-fit">
                  <Clock className="w-3 h-3" />{" "}
                  <span>
                    {task?.deadlineAt
                      ? formatDistance(new Date(task?.deadlineAt), new Date(), {
                          addSuffix: true,
                        })
                      : "Deadline's not set"}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="min-w-52 max-w-52 p-4">
                {task?.deadlineAt ? (
                  <div>
                    <div className="flex text-sm font-header items-center gap-1">
                      <span>
                        {formatDate(new Date(task?.deadlineAt), "PPP p")}
                      </span>
                    </div>
                    <div className="flex text-xs font-body items-center gap-1 mt-2">
                      <span>
                        {formatDistance(
                          new Date(task?.deadlineAt),
                          new Date(),
                          {
                            addSuffix: true,
                          }
                        )}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p>
                      We strongly advise you to consistently set a deadline for
                      each task.
                    </p>

                    <p>
                      {`Deadline is automatically set for you if you included time on the task name, like "Tomorrow" or "Next Week at 9pm"`}
                    </p>
                  </div>
                )}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Completion Percentage */}
          <div className="pt-4 flex items-end">
            <CircularProgress
              size={50}
              strokeWidth={5}
              totalNumber={1}
              currentNumber={0}
            />
          </div>
        </div>
      </div>
    );
  }
);

Card.displayName = "TaksCard";

export default Card;
