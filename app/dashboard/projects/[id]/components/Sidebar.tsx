"use client";

import { CirclePlus, Logs, UserPlus, UsersRound } from "lucide-react";
import Link from "next/link";
import type { ExtendedProjectType } from "@/src/lib/app/app";
import StackedAvatars from "@/src/ui/components/ui/StackedAvatars";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import StatisticsTable from "./StatisticsTable";

const Sidebar = ({ project }: { project?: ExtendedProjectType }) => {
  const members =
    project?.memberships?.flatMap((membership) =>
      membership?.member ? [membership?.member] : [],
    ) || [];

  return (
    <aside className="space-y-6">
      {/* Members */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h1>Members</h1>

          <Button variant={"outline"} size={"sm"} className="text-xs">
            <UsersRound /> Manage
          </Button>
        </div>
        <StackedAvatars users={members} />
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <h1>Statistics</h1>

        <StatisticsTable project={project} />
      </div>

      {/* Controller */}
      <div className="grid grid-cols-2 gap-2">
        <Button>
          <CirclePlus /> New Task
        </Button>
        <Button variant={"outline"}>
          <UserPlus /> Invite
        </Button>
      </div>

      {/* Logs */}
      <div className="grid grid-cols-1">
        <Button variant={"outline"} asChild disabled={!project?.id}>
          <Link href={`/dashboard/projects/${project?.id}/log`}>
            <Logs /> <span>Logs</span>
          </Link>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
