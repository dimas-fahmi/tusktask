import { SubtaskType } from "@/src/types/task";
import React from "react";
import ScratchButton from "../ScratchButton";
import { Button } from "../../../shadcn/ui/button";
import {
  Archive,
  Ellipsis,
  ExternalLink,
  LoaderCircle,
  Tag,
  Trash,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../shadcn/ui/popover";
import PopoverAction from "../Popover/PopoverAction";
import { Separator } from "../../../shadcn/ui/separator";
import { useRouter } from "next/navigation";
import { subtasksObserver } from "@/src/lib/tusktask/utils/subtasksObserver";
import { CreatedByOptimisticUpdate } from "@/src/types/types";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";

export interface SubtaskCardProps {
  task: SubtaskType & CreatedByOptimisticUpdate;
}

const SubtaskCard: React.FC<SubtaskCardProps> = ({ task }) => {
  // Initialize router
  const router = useRouter();

  // ELigibility mechanism
  const { ineligible } = subtasksObserver(task);

  // Pull notification context values
  const { triggerAlertDialog } = useNotificationContext();

  return (
    <div
      className={`group/SubtaskCard py-2 px-4 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md flex gap-2 items-center transition-all duration-300 ${task?.createdByOptimisticUpdate ? "opacity-50 animate-pulse" : ""}`}
      onClick={() => {
        if (task?.createdByOptimisticUpdate) {
          triggerAlertDialog({
            title: "Wait A Moment",
            description: "We're still saving your new task",
          });
          return;
        }
        router.push(`/dashboard/task/${task?.id}`);
      }}
    >
      {/* Scratch Button */}
      <div className="flex items-center pt-0.5">
        {task?.createdByOptimisticUpdate ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <ScratchButton size="md" task={task} ineligible={ineligible} />
        )}
      </div>

      {/* Details */}
      <div className="flex-grow">
        <header className="flex items-center justify-between">
          <h1 className="capitalize">{task?.name}</h1>

          <span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="group-hover/SubtaskCard:opacity-100 opacity-0 transition-all duration-300 !py-0"
                  variant={"empty"}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Ellipsis />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="!p-1 space-y-1.5">
                <PopoverAction
                  title="Open task"
                  Icon={ExternalLink}
                  onClick={() => {
                    router.push(`/dashboard/task/${task?.id}`);
                  }}
                />
                <Separator />
                <PopoverAction title="Archive" Icon={Archive} />
                <PopoverAction title="Set Status" Icon={Tag} />
                <Separator />
                <PopoverAction
                  title="Delete task"
                  variant="destructive"
                  Icon={Trash}
                />
              </PopoverContent>
            </Popover>
          </span>
        </header>
      </div>
    </div>
  );
};

export default SubtaskCard;
