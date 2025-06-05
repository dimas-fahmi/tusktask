import React from "react";
import { Separator } from "../../../shadcn/ui/separator";
import {
  CircleAlert,
  CirclePlus,
  Ellipsis,
  ExternalLink,
  LoaderCircle,
  LogOut,
  MessageCircle,
  Sparkle,
  Users,
  UsersRound,
} from "lucide-react";
import CircularProgress from "../CircularProgress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../shadcn/ui/popover";
import PopoverAction from "../Popover/PopoverAction";
import useTeamContext from "@/src/lib/tusktask/hooks/context/useTeamContext";
import { useRouter } from "next/navigation";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import { FullTeam } from "@/src/types/team";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../shadcn/ui/tooltip";
import Link from "next/link";

export interface TeamCardProps {
  team: FullTeam;
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  // Pull teams memberships
  const { teamsMemberships } = useTeamContext();

  // Find out about team memberships
  const membership = !teamsMemberships
    ? null
    : teamsMemberships.filter((t) => t?.teamId === team?.id);

  const tasks = team?.tasks ? team.tasks : [];
  const completedTasks =
    tasks.length === 0 ? [] : tasks.filter((t) => t.status === "completed");

  // Initialize router
  const router = useRouter();

  // Pull triggers from notification context
  const { triggerToast } = useNotificationContext();

  const isPrimary = team?.type === "primary";

  return (
    <div
      className={`${team?.createdByOptimisticUpdate ? "cursor-wait animate-pulse" : "cursor-pointer hover:shadow-xl "} border rounded-md transition-all duration-300 shadow-md`}
      onClick={() => {
        if (team?.createdByOptimisticUpdate) {
          triggerToast({
            type: "default",
            title: "Please Wait A Moment",
            description:
              "We're still saving your new team, please wait a moment.",
          });
          return;
        }

        router.push(`/dashboard/teams/${team?.id}`);
      }}
    >
      {/* Card Information */}
      <div className="p-4">
        <header>
          <h1 className="text-xl font-bold">{team.name}</h1>
        </header>
        <div className="text-xs text-muted-foreground min-h-16">
          No Description
        </div>
      </div>

      {/* Card Controller */}
      {!team?.createdByOptimisticUpdate && <Separator />}
      <footer className="text-xs flex h-7">
        {team?.createdByOptimisticUpdate ? (
          <span className="px-4 py-2 flex items-center justify-center gap-1.5">
            <LoaderCircle className="animate-spin w-3 h-3" /> Saving
          </span>
        ) : (
          <>
            <span className="px-4 py-2 flex items-center justify-center gap-1.5">
              <CircularProgress
                current={completedTasks.length}
                total={tasks.length}
                size={12}
              />
              {completedTasks.length}/{tasks.length}
            </span>
            <Separator orientation="vertical" />
            {team?.type === "primary" ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="px-4 py-2 items-center justify-around flex gap-1.5">
                    <Sparkle className="w-3 h-3" /> Primary
                  </span>
                </TooltipTrigger>
                <TooltipContent className="flex items-center gap-1">
                  <CircleAlert className="w-4 h-4" />
                  <span>
                    This is your primary team,{" "}
                    <Link
                      href={"/"}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="underline hover:text-accent"
                    >
                      Read more about it
                    </Link>
                    .
                  </span>
                </TooltipContent>
              </Tooltip>
            ) : (
              <span className="px-4 py-2 items-center justify-around flex gap-1.5">
                <Users className="w-3 h-3" />{" "}
                {team?.teamMembers && team.teamMembers.length}
              </span>
            )}
            {membership && (
              <>
                <Separator orientation="vertical" />
                <span className="px-4 py-2 flex items-center justify-center capitalize">
                  {membership && membership[0]?.userRole}
                </span>
              </>
            )}
            <Separator orientation="vertical" />
            <span className="flex items-center justify-end flex-grow pe-2">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="opacity-50 hover:opacity-100 cursor-pointer"
                  >
                    <Ellipsis className="w-4 h-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="p-1 space-y-2">
                  <PopoverAction Icon={ExternalLink} title="Open Team" />
                  <Separator />
                  <PopoverAction Icon={CirclePlus} title="New Task" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverAction
                        Icon={UsersRound}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isPrimary) return;
                        }}
                        title="Members"
                        variant={isPrimary ? "disabled" : "default"}
                      />
                    </TooltipTrigger>
                    <TooltipContent className={`${isPrimary ? "" : "hidden"}`}>
                      {isPrimary ? (
                        <>
                          This is your primary team, it should be private. Learn
                          more
                        </>
                      ) : (
                        <></>
                      )}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverAction
                        Icon={MessageCircle}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isPrimary) return;
                        }}
                        title="Chatroom"
                        variant={isPrimary ? "disabled" : "default"}
                      />
                    </TooltipTrigger>
                    <TooltipContent className={`${isPrimary ? "" : "hidden"}`}>
                      {isPrimary ? (
                        <>
                          This is your primary team, it should be private. Learn
                          more
                        </>
                      ) : (
                        <></>
                      )}
                    </TooltipContent>
                  </Tooltip>
                  <Separator />
                  <PopoverAction
                    Icon={LogOut}
                    title="Leave Team"
                    variant="destructive"
                  />
                </PopoverContent>
              </Popover>
            </span>
          </>
        )}
      </footer>
    </div>
  );
};

export default TeamCard;
