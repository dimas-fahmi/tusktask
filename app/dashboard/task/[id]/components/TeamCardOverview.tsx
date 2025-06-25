import useTeamContext from "@/src/lib/tusktask/hooks/context/useTeamContext";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import {
  CircleCheckBig,
  Equal,
  ExternalLink,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const TeamCardOverview = () => {
  // Pull Team Context
  const { teamDetail } = useTeamContext();

  // Subtasks
  const tasks = teamDetail?.tasks ? teamDetail.tasks : [];
  const completedTasks = tasks.filter((t) => t.status === "completed");
  const shoppingLists = tasks.filter((t) => t.type === "shopping_list");

  return (
    <div className="rounded-md border p-4">
      <header className="pb-2">
        <div className="flex justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold">{teamDetail?.name}</h1>
            <p className="text-xs leading-4">
              Completed tasks and shopping lists, along with the totals for
              both.
            </p>
          </div>
          <Button
            variant={"ghost"}
            size={"sm"}
            asChild
            disabled={!teamDetail?.id}
          >
            <Link href={`/dashboard/teams/${teamDetail?.id}`}>
              <ExternalLink />
            </Link>
          </Button>
        </div>
      </header>
      <div className="grid grid-cols-3 gap-1">
        {/* Completed Tasks */}
        <div className="text-xs border py-2 rounded-md justify-center flex items-center gap-1.5">
          <span>
            <CircleCheckBig className="w-3 h-3" />
          </span>
          <span className="font-bold">{completedTasks.length}</span>
        </div>

        {/* Shopping List */}
        <div className="text-xs border py-2 rounded-md justify-center flex items-center gap-1.5">
          <span>
            <ShoppingCart className="w-3 h-3" />
          </span>
          <span className="font-bold">{shoppingLists.length}</span>
        </div>

        {/* Total Tasks */}
        <div className="text-xs border py-2 rounded-md justify-center flex items-center gap-1.5">
          <span>
            <Equal className="w-3 h-3" />
          </span>
          <span className="font-bold">{tasks.length}</span>
        </div>
      </div>
    </div>
  );
};

export default TeamCardOverview;
