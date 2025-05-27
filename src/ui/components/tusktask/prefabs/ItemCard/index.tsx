import {
  Archive,
  BaggageClaim,
  CalendarSync,
  CircleCheckBig,
  Ellipsis,
  ExternalLink,
  Hash,
  LoaderCircle,
  Pickaxe,
  ShoppingCart,
  Signature,
  Star,
  Tag,
  Trash,
  Wallet,
} from "lucide-react";
import React, { useState } from "react";
import CircularProgress from "../CircularProgress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../shadcn/ui/popover";
import { FullTask } from "@/src/types/task";
import PopoverAction from "../Popover/PopoverAction";
import { Separator } from "@radix-ui/react-select";
import { Skeleton } from "../../../shadcn/ui/skeleton";
import { useRouter } from "next/navigation";
import useTaskContext from "@/src/lib/tusktask/hooks/context/useTaskContext";

export const ItemCardSkeleton = () => {
  return (
    <div className="p-4 pe-2.5 flex justify-between items-center">
      <div className="flex gap-1.5">
        <div className="flex gap-1.5">
          <Skeleton className="w-4 h-4" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-40 h-4" />
          <div className="flex gap-1">
            <Skeleton className="w-10 h-4" />
            <Skeleton className="w-10 h-4" />
            <Skeleton className="w-10 h-4" />
            <Skeleton className="w-10 h-4" />
          </div>
        </div>
      </div>
      <div>
        <Skeleton className="w-6 h-4" />
      </div>
    </div>
  );
};

const ItemCard = ({ task }: { task: FullTask }) => {
  // Render Icon
  const Icon = task?.type === "shopping_list" ? ShoppingCart : Hash;

  // Initialize router
  const router = useRouter();

  // Pull TaskContext
  const { deleteTask, isDeletingTask, taskDeleteKey, setTaskDeleteKey } =
    useTaskContext();

  // Popover state
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`${task?.createdByOptimisticUpdate ? "animate-pulse" : ""} px-4 py-4 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md text-sm text-muted-foreground flex items-center justify-between`}
    >
      {/* Information */}
      <div className="flex gap-1.5">
        <div className="flex items-start pt-1 gap-1.5">
          <span>
            <Icon className={`w-3.5 h-3.5`} />
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="capitalize">{task?.name}</span>
          {/* Metadata */}
          <div className="gap-3 flex">
            {task?.createdByOptimisticUpdate && (
              <div className="flex items-center gap-1">
                <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
                <span className="text-xs">Saving</span>
              </div>
            )}

            {taskDeleteKey === task?.id && (
              <div className="flex items-center gap-1">
                <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
                <span className="text-xs">Deleting</span>
              </div>
            )}
            {taskDeleteKey !== task?.id && !task?.createdByOptimisticUpdate && (
              <>
                <div className="flex items-center gap-1">
                  <CircularProgress
                    current={3}
                    total={7}
                    size={11}
                    className=""
                  />
                  <span className="text-xs">3/7</span>
                </div>
                {task?.type === "shopping_list" && task?.price && (
                  <div className="flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5" />
                    <span className="text-xs">{task?.price}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5" />
                  <span className="text-xs">{task?.owner?.username}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Signature className="w-3.5 h-3.5" />
                  <span className="text-xs">{task?.creator?.username}</span>
                </div>
                {task?.claimedById && (
                  <div className="flex items-center gap-1">
                    <Pickaxe className="w-3.5 h-3.5" />
                    <span className="text-xs">{task?.claimedBy?.username}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="cursor-pointer opacity-50 hover:opacity-100">
            <Ellipsis className="w-4 h-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="!p-1 space-y-2">
          <PopoverAction
            Icon={ExternalLink}
            title="Open Task"
            action={() => {
              router.push(`/dashboard/tasks/id/${task?.id}`);
            }}
          />
          <PopoverAction
            Icon={CircleCheckBig}
            title="Scratch This"
            action={() => {}}
          />
          <PopoverAction
            Icon={BaggageClaim}
            title="Claim This"
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
            title="Delete This Task"
            action={() => {
              setTaskDeleteKey(task.id);

              deleteTask({
                taskId: task.id,
                teamId: task.teamId,
              });

              setOpen(false);
            }}
            variant="destructive"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ItemCard;
