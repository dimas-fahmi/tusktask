import { TaskWithSubtasks } from "@/app/api/tasks/get";
import { truncateText } from "@/src/lib/tusktask/utils/truncateText";
import {
  Archive,
  Building,
  CalendarSync,
  Circle,
  Ellipsis,
  ExternalLink,
  Hourglass,
  Tag,
  Trash,
} from "lucide-react";
import React from "react";
import CircularProgress from "../CircularProgress";
import { timeDistanceFromNow } from "@/src/lib/tusktask/utils/timeDistanceFromNow";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../shadcn/ui/tooltip";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../shadcn/ui/popover";
import PopoverAction from "../Popover/PopoverAction";
import { Separator } from "../../../shadcn/ui/separator";
// TaskCard component displays a summary of a task, including its name, description, subtasks progress, team, and deadline.
const TaskCard = ({ task }: { task: TaskWithSubtasks }) => {
  const { subtasks, team } = task;
  const completedSubtasks = subtasks.filter(
    (t) => t.status === "completed"
  ).length;

  // Initialize router
  const router = useRouter();

  return (
    <article
      className="border max-w-[380px] rounded-md cursor-pointer md:hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
      aria-labelledby={`task-title-${task.id}`}
      role="group"
      onClick={() => {
        router.push(`/dashboard/tasks/id/${task.id}`);
      }}
    >
      <header className="px-4 pt-4 flex items-center gap-2" title={task.name}>
        <Circle className="w-5 h-5" aria-hidden="true" />
        <h2 id={`task-title-${task.id}`} className="text-base font-medium">
          {truncateText(task.name, 5)}
        </h2>
      </header>

      <section
        className="text-xs mt-2 px-4 pb-4 text-muted-foreground"
        aria-label="Task description"
      >
        {task.description
          ? truncateText(task.description, 7)
          : "No description"}
      </section>

      <footer
        className="flex items-center space-x-1 text-xs text-muted-foreground"
        aria-label="Task metadata"
      >
        {subtasks.length > 0 && (
          <section
            className="flex items-center justify-center ps-4 px-2 py-2"
            aria-label="Subtask progress"
          >
            <CircularProgress
              size={14}
              current={completedSubtasks}
              total={subtasks.length}
              aria-label={`Subtasks completed: ${completedSubtasks} out of ${subtasks.length}`}
            />
            <span className="mb-0.5 ms-1">
              {completedSubtasks}/{subtasks.length}
            </span>
          </section>
        )}

        <section
          className={`${
            subtasks.length === 0 ? "ps-4" : ""
          } flex items-center justify-center gap-1 px-1 py-2`}
          aria-label="Team"
        >
          <Building className="w-3 h-3" aria-hidden="true" />
          <span
            className="truncate max-w-[100px]"
            title={team?.name ?? "_no_team"}
          >
            {team?.name ?? "_no_team"}
          </span>
        </section>

        <section className="block px-1 py-2" aria-label="Deadline">
          {task.deadlineAt ? (
            <div className="flex items-center gap-1">
              <Hourglass className="w-3 h-3" aria-hidden="true" />
              <span className="truncate">
                {timeDistanceFromNow(task.deadlineAt)}
              </span>
            </div>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="flex items-center gap-1"
                    aria-label="Deadline not set"
                  >
                    <Hourglass className="w-3 h-3" aria-hidden="true" />
                    <span>Not Set</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Deadline is not set. Keep your work organized by setting a
                    deadline at the start.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </section>

        <Popover>
          <PopoverTrigger asChild>
            <div
              className="flex justify-end px-1 py-2 flex-grow pe-4 opacity-50 hover:opacity-100 transition-all duration-300"
              role="button"
              aria-label="More options"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Ellipsis className="w-5 h-5" aria-hidden="true" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="!p-1 space-y-2">
            <PopoverAction
              Icon={ExternalLink}
              title="Open Task"
              action={() => {}}
            />
            <Separator />
            <PopoverAction Icon={Archive} title="Archive" action={() => {}} />
            <PopoverAction
              Icon={Tag}
              title="Set Status"
              subTitle={task.status}
              action={() => {}}
            />
            <PopoverAction
              Icon={CalendarSync}
              title="Reschedule"
              action={() => {}}
            />
            <Separator />
            <PopoverAction
              Icon={Trash}
              title="Move to trash"
              action={() => {}}
              variant="destructive"
            />
          </PopoverContent>
        </Popover>
      </footer>
    </article>
  );
};

export default TaskCard;
