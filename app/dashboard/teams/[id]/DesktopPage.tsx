import React, { useEffect, useState } from "react";
import OverviewSection from "./fragments/OverviewSection";
import ActionsSection from "./fragments/ActionsSection";
import FilterSection from "./fragments/FilterSection";
import { ScrollArea } from "@/src/ui/components/shadcn/ui/scroll-area";
import ItemCard, {
  ItemCardSkeleton,
} from "@/src/ui/components/tusktask/prefabs/ItemCard";
import useTeamContext from "@/src/lib/tusktask/hooks/context/useTeamContext";
import MainLoader from "@/src/ui/components/tusktask/prefabs/MainLoader";
import { FolderGit2 } from "lucide-react";
import { filterTasks, FilterType } from "@/src/lib/tusktask/utils/filterTasks";
import useTaskContext from "@/src/lib/tusktask/hooks/context/useTaskContext";
import { Skeleton } from "@/src/ui/components/shadcn/ui/skeleton";

const DesktopPage = ({ id }: { id: string }) => {
  // Filter States
  const [filter, setFilter] = useState<FilterType>("all");

  // Query Team
  const { teamDetail, setTeamDetailKey, isFetchingTeams } = useTeamContext();

  //
  const tasks = teamDetail?.tasks
    ? filterTasks(teamDetail.tasks, filter, "createdAt", "desc")
    : [];

  // Trigger Fetch
  useEffect(() => {
    setTeamDetailKey(id);
  }, []);

  return (
    <div>
      <div className="grid grid-cols-[auto_280px] min-h-96 gap-4">
        <div className="">
          {/* Header */}
          <header className="mb-6">
            {teamDetail?.name ? (
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <FolderGit2 />
                {teamDetail?.name}
              </h1>
            ) : (
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-80" />
              </div>
            )}
          </header>

          {/* Items */}
          <ScrollArea className="h-[1000px]">
            <div className="space-y-3">
              {!teamDetail && (
                <>
                  <ItemCardSkeleton />
                  <ItemCardSkeleton />
                  <ItemCardSkeleton />
                  <ItemCardSkeleton />
                </>
              )}

              {tasks.map((task) => (
                <ItemCard task={task} key={task.id} />
              ))}

              {teamDetail && tasks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center">
                  No items, create a new one.
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
        <aside className="overflow-hidden space-y-4">
          {/* Section Actions */}
          <ActionsSection teamId={id} />
          {/* Overview Section */}
          <OverviewSection />
          {/* Filter Card */}
          <FilterSection filter={filter} setFilter={setFilter} />
        </aside>
      </div>
    </div>
  );
};

export default DesktopPage;
