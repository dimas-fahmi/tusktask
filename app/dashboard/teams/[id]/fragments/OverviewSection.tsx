import React from "react";
import CircularProgress from "@/src/ui/components/tusktask/prefabs/CircularProgress";
import { Clipboard, ShoppingCart, Users } from "lucide-react";
import useTeamContext from "@/src/lib/tusktask/hooks/context/useTeamContext";
import { filterTasks } from "@/src/lib/tusktask/utils/filterTasks";

const OverviewSection = () => {
  // Pull states from team context
  const { teamDetail } = useTeamContext();

  const tasks = teamDetail?.tasks ? filterTasks(teamDetail?.tasks, "task") : [];
  const shoppingLists = teamDetail?.tasks
    ? filterTasks(teamDetail?.tasks, "shopping")
    : [];
  const members = teamDetail?.teamMembers;

  return (
    <section
      id="overview"
      className="w-full border p-4 text-sm rounded-md space-y-3"
    >
      {/* Overview Item */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span>
            <Clipboard className="w-4 h-4" />
          </span>
          <span>Tasks</span>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <CircularProgress
            current={
              tasks && tasks.filter((t) => t.status === "completed").length
            }
            total={tasks?.length}
            size={13}
          />
          {tasks && tasks.filter((t) => t.status === "completed").length}/
          {tasks?.length}
        </div>
      </div>

      {/* Overview Item */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span>
            <ShoppingCart className="w-4 h-4" />
          </span>
          <span>Shopping Lists</span>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <CircularProgress
            current={
              shoppingLists &&
              shoppingLists.filter((s) => s.status === "completed").length
            }
            total={shoppingLists?.length}
            size={13}
          />
          {shoppingLists &&
            shoppingLists.filter((s) => s.status === "completed").length}
          /{shoppingLists?.length}
        </div>
      </div>

      {/* Overview Item */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span>
            <Users className="w-4 h-4" />
          </span>
          <span>Members</span>
        </div>
        <div className="text-xs text-muted-foreground">{members?.length}</div>
      </div>
    </section>
  );
};

export default OverviewSection;
