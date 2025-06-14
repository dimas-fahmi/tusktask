import {
  Archive,
  BaggageClaim,
  CalendarSync,
  Circle,
  CircleCheckBig,
  Clock,
  Ellipsis,
  ExternalLink,
  Hash,
  LoaderCircle,
  Pickaxe,
  ShoppingCart,
  Signature,
  Tag,
  Trash,
  UserRoundCheck,
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
import { Skeleton } from "../../../shadcn/ui/skeleton";
import { useRouter } from "next/navigation";
import useTaskContext from "@/src/lib/tusktask/hooks/context/useTaskContext";
import { formatNumber } from "@/src/lib/tusktask/utils/formatNumber";
import { Separator } from "../../../shadcn/ui/separator";
import { timePassed } from "@/src/lib/tusktask/utils/timePassed";
import useTeamContext from "@/src/lib/tusktask/hooks/context/useTeamContext";
import { usePermission } from "@/src/lib/tusktask/hooks/membership/usePermission";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import { useSession } from "next-auth/react";

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

const ItemCard = ({
  task,
  completed = false,
}: {
  task: FullTask;
  completed?: boolean;
}) => {
  // Render Icon
  const Icon = task?.type === "shopping_list" ? ShoppingCart : Hash;

  // Initialize router
  const router = useRouter();

  // Pull TaskContext
  const { deleteTask, updateTask, taskDeleteKey, setTaskDeleteKey } =
    useTaskContext();

  // Pull TeamContext
  const { myMembership } = useTeamContext();

  // Pull notification context
  const { triggerToast, triggerAlertDialog } = useNotificationContext();

  // Popover state
  const [open, setOpen] = useState(false);

  // Permission
  const { canDeleteTask, canScratchTask } = usePermission(myMembership);

  // Pull Session
  const { data: session } = useSession();

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
          <span className={`capitalize ${completed ? "line-through" : ""}`}>
            {task?.name}
          </span>
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
                {!completed && (
                  <div className="flex items-center gap-1">
                    <CircularProgress
                      current={3}
                      total={7}
                      size={11}
                      className=""
                    />
                    <span className="text-xs">3/7</span>
                  </div>
                )}
                {task?.type === "shopping_list" && task?.price && (
                  <div className="flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5" />
                    <span className="text-xs">{formatNumber(task.price)}</span>
                  </div>
                )}
                {!completed && (
                  <>
                    <div className="flex items-center gap-1">
                      <Signature className="w-3.5 h-3.5" />
                      <span className="text-xs">{task?.creator?.username}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs">
                        {timePassed(task?.createdAt)}
                      </span>
                    </div>
                  </>
                )}

                {completed && task?.completedBy && (
                  <div className="flex items-center gap-1">
                    <UserRoundCheck className="w-3.5 h-3.5" />
                    <span className="text-xs">
                      Completed by {task.completedBy?.username}
                    </span>
                  </div>
                )}

                {completed && (
                  <div className="flex items-center gap-1">
                    <CircleCheckBig className="w-3.5 h-3.5" />
                    <span className="text-xs">
                      {timePassed(task?.completedAt)}
                    </span>
                  </div>
                )}

                {task?.claimedById && !completed && (
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
            onClick={() => {
              router.push(`/dashboard/tasks/id/${task?.id}`);
            }}
          />
          <PopoverAction
            className={`${!canScratchTask ? "opacity-50" : ""}`}
            Icon={completed ? Circle : CircleCheckBig}
            title={!completed ? "Scratch This" : "Unscratch This"}
            onClick={() => {
              if (!canScratchTask) {
                return;
              }

              if (task?.claimedById) {
                triggerAlertDialog({
                  title: "Oops, Miscomunication?",
                  description: `${task?.completedBy?.username} already claimed this task, tell them you got it?`,
                  showCancelButton: true,
                  confirmText: "Send",
                  confirm: () => {
                    // Send notification to unclaim task
                  },
                });

                return;
              }

              triggerAlertDialog({
                title: !completed
                  ? "Scratch This Task?"
                  : "Mark This incomplete?",
                description: !completed
                  ? "Are you sure you want to mark this task as complete?"
                  : "Are you sure you want to mark this task to incomplete?",
                showCancelButton: true,
                confirmText: !completed ? "Scratch" : "Continue",
                confirm: () => {
                  if (!session?.user?.id) return;

                  updateTask({
                    id: task.id,
                    teamId: task.teamId,
                    operation: !completed ? "complete" : "update",
                    newValues: {
                      completedById: !completed ? session?.user?.id : null,
                      completedAt: !completed ? new Date() : null,
                      status: !completed ? "completed" : "not_started",
                    },
                  });
                },
              });
            }}
          />
          {!completed && (
            <PopoverAction
              Icon={BaggageClaim}
              onClick={async () => {
                if (task.claimedById) {
                  triggerAlertDialog({
                    title: "Not Quick Enough Cowboy!",
                    description: `${task?.claimedBy.username} claimed this task faster than you.`,
                    confirmText: "SNAP!",
                  });
                  return;
                }

                triggerAlertDialog({
                  title: "Guys, let me handle this one!",
                  description:
                    "Claim this task and tell your friends 'You got it'?",
                  showCancelButton: true,
                  confirmText: "Claim",
                  icon: BaggageClaim,
                  confirm: () => {
                    updateTask({
                      id: task.id,
                      teamId: task.teamId,
                      operation: "update",
                      newValues: {
                        claimedById: session?.user.id,
                      },
                    });
                  },
                });
              }}
              title="Claim This"
            />
          )}
          <Separator />
          <PopoverAction Icon={Archive} title="Archive" onClick={() => {}} />
          {!completed && (
            <PopoverAction
              Icon={Tag}
              title="Set Status"
              subTitle={task.status}
            />
          )}
          {!completed && (
            <PopoverAction Icon={CalendarSync} title="Reschedule" />
          )}
          <Separator />
          <PopoverAction
            Icon={Trash}
            title="Delete This Task"
            onClick={() => {
              if (!canDeleteTask) {
                triggerToast({
                  type: "default",
                  title: "Insufficient Access",
                  description: "Only administrators can perform this action",
                });

                return;
              }

              setTaskDeleteKey(task.id);
              deleteTask({
                taskId: task.id,
                teamId: task.teamId,
              });
              setOpen(false);
            }}
            variant={canDeleteTask ? "destructive" : "disabled"}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ItemCard;
