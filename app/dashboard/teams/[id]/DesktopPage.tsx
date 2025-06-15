import React, { useEffect, useState } from "react";
import OverviewSection from "./fragments/OverviewSection";
import ActionsSection from "./fragments/ActionsSection";
import FilterSection from "./fragments/FilterSection";
import { ScrollArea } from "@/src/ui/components/shadcn/ui/scroll-area";
import ItemCard, {
  ItemCardSkeleton,
} from "@/src/ui/components/tusktask/prefabs/ItemCard";
import useTeamContext from "@/src/lib/tusktask/hooks/context/useTeamContext";
import {
  ChevronDown,
  ChevronUp,
  FolderGit2,
  MessageCircle,
  UsersRound,
} from "lucide-react";
import { filterTasks, FilterType } from "@/src/lib/tusktask/utils/filterTasks";
import { Skeleton } from "@/src/ui/components/shadcn/ui/skeleton";
import { motion } from "motion/react";
import ShoppingListOverview from "./fragments/ShoppingListOverview";
import { SetStateAction } from "@/src/types/types";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/ui/components/shadcn/ui/collapsible";

const DesktopPage = ({
  id,
  setTeamChatOpen,
}: {
  id: string;
  setTeamChatOpen: SetStateAction<boolean>;
}) => {
  // Collapsible State
  const [onProcessOpen, setOnProcessOpen] = useState(false);
  const [completedOpen, setCompletedOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);

  // Filter States
  const [filter, setFilter] = useState<FilterType>("todo");

  // Query Team
  const { teamDetail, setTeamDetailKey, setTeamMembershipDialog } =
    useTeamContext();

  // Filter Task
  const tasks = teamDetail?.tasks
    ? filterTasks(teamDetail.tasks, filter, "createdAt", "desc")
    : [];

  const onProcessTask = teamDetail?.tasks
    ? filterTasks(teamDetail?.tasks, "process", "createdAt", "desc")
    : [];

  const completedTask = teamDetail?.tasks
    ? filterTasks(teamDetail.tasks, "completed", "createdAt", "desc")
    : [];

  const archivedTask = teamDetail?.tasks
    ? filterTasks(teamDetail.tasks, "archived", "createdAt", "desc")
    : [];

  // Tasks createdByOptimisticUpdate
  const createdByOptimisticUpdates = teamDetail?.tasks
    ? filterTasks(teamDetail.tasks, "createdByOptimisticUpdate")
    : [];

  // Shopping Lists
  const shoppingList = teamDetail?.tasks
    ? filterTasks(teamDetail?.tasks, "shopping")
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
            <div className="space-y-1">
              {!teamDetail && (
                <>
                  <ItemCardSkeleton />
                  <ItemCardSkeleton />
                  <ItemCardSkeleton />
                  <ItemCardSkeleton />
                </>
              )}

              {createdByOptimisticUpdates.map((task) => (
                <ItemCard task={task} key={task.id} />
              ))}

              {tasks.map((task) => (
                <ItemCard task={task} key={task.id} />
              ))}

              {teamDetail &&
                tasks.length === 0 &&
                createdByOptimisticUpdates.length === 0 &&
                completedTask.length !== 0 && (
                  <p className="text-sm text-muted-foreground text-center">
                    All task is completed, good job!
                  </p>
                )}

              {onProcessTask.length !== 0 && (
                <Collapsible
                  open={onProcessOpen}
                  onOpenChange={setOnProcessOpen}
                >
                  <CollapsibleTrigger className="border-b w-full text-start py-2 px-4 cursor-pointer text-sm flex justify-between">
                    <span>On Process Tasks</span>
                    <span>
                      {completedOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {onProcessTask.map((task) => (
                      <ItemCard task={task} key={task.id} />
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}

              {completedTask.length !== 0 && (
                <Collapsible
                  open={completedOpen}
                  onOpenChange={setCompletedOpen}
                >
                  <CollapsibleTrigger className="border-b w-full text-start py-2 px-4 cursor-pointer text-sm flex justify-between">
                    <span>Completed Tasks</span>
                    <span>
                      {completedOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {completedTask.map((task) => (
                      <ItemCard task={task} key={task.id} completed />
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}

              {archivedTask.length !== 0 && (
                <Collapsible open={archiveOpen} onOpenChange={setArchiveOpen}>
                  <CollapsibleTrigger className="border-b w-full text-start py-2 px-4 cursor-pointer text-sm flex justify-between">
                    <span>Archived Tasks</span>
                    <span>
                      {completedOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {archivedTask.map((task) => (
                      <ItemCard task={task} key={task.id} />
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}

              {teamDetail &&
                tasks.length === 0 &&
                createdByOptimisticUpdates.length === 0 &&
                completedTask.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center">
                    No items, create a new one.
                  </p>
                )}
            </div>
          </ScrollArea>
        </div>
        <aside className="overflow-hidden space-y-4">
          {/* Shopping List Overview */}
          <motion.div
            variants={{
              open: { height: "auto", opacity: 1 },
              closed: { height: 0, opacity: 0 },
            }}
            initial="closed"
            animate={shoppingList.length !== 0 ? "open" : "closed"}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
          >
            <ShoppingListOverview shoppingList={shoppingList} />
          </motion.div>

          {/* Section Actions */}
          <ActionsSection teamId={id} />

          {/* Overview Section */}
          <OverviewSection />

          {/* Memberships & Co-Operation Actions */}
          <div className="flex gap-2 w-full">
            <Button
              variant={"outline"}
              className="flex-grow"
              onClick={() => setTeamChatOpen(true)}
            >
              <MessageCircle />
              Messages
            </Button>
            <Button
              variant={"outline"}
              className="flex-grow"
              onClick={() => setTeamMembershipDialog(true)}
            >
              <UsersRound />
              Members
            </Button>
          </div>

          {/* Filter Card */}
          <FilterSection filter={filter} setFilter={setFilter} />
        </aside>
      </div>
    </div>
  );
};

export default DesktopPage;
