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
  FolderGit2,
  LoaderCircle,
  MessageCircle,
  MessageCirclePlus,
  UsersRound,
} from "lucide-react";
import { filterTasks, FilterType } from "@/src/lib/tusktask/utils/filterTasks";
import { Skeleton } from "@/src/ui/components/shadcn/ui/skeleton";
import { motion } from "motion/react";
import ShoppingListOverview from "./fragments/ShoppingListOverview";
import { SetStateAction } from "@/src/types/types";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import CollapsibleTaskSection from "@/src/ui/components/tusktask/prefabs/CollapsibleTaskSection";
import { useQueryClient } from "@tanstack/react-query";
import { DetailConversationGetResponse } from "@/app/api/conversations/[id]/details/get";
import { newChatMutation } from "@/src/lib/tusktask/mutation/newChatMutation";
import { useRouter } from "next/navigation";
import useChatStore from "@/src/lib/tusktask/store/chatStore";

const DesktopPage = ({
  id,
}: {
  id: string;
  setTeamChatOpen: SetStateAction<boolean>;
}) => {
  // Collapsible State
  const [onProcessOpen, setOnProcessOpen] = useState(false);
  const [completedOpen, setCompletedOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);

  // Filter States
  const [filter, setFilter] = useState<FilterType>("top_level_task");

  // Query Team
  const { teamDetail, setTeamDetailKey, setTeamMembershipDialog } =
    useTeamContext();

  // Pull query client
  const queryClient = useQueryClient();

  // Get Query Data
  const conversationResponse = queryClient.getQueryData([
    "conversation",
    id,
  ]) as DetailConversationGetResponse;
  const conversationDetails = conversationResponse?.data;

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

  // Router
  const router = useRouter();

  // Pull setters
  const setSelectedRoom = useChatStore((s) => s.setSelectedRoom);

  // New Chat Room Mutation
  const { createNewChat, isPending, isIdle } = newChatMutation(
    ["conversation", "new", id],
    queryClient,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["conversation", id],
        });

        router.push("/dashboard/messages");
        setSelectedRoom(id);
      },
    }
  );

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
          <ScrollArea className="h-[1000px] pe-3">
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
                <CollapsibleTaskSection
                  label="On Process Tasks"
                  data={onProcessTask}
                  open={onProcessOpen}
                  setOpen={setOnProcessOpen}
                />
              )}

              {completedTask.length !== 0 && (
                <CollapsibleTaskSection
                  label="Completed Tasks"
                  data={completedTask}
                  open={completedOpen}
                  setOpen={setCompletedOpen}
                  completed
                />
              )}

              {archivedTask.length !== 0 && (
                <CollapsibleTaskSection
                  label="Archived Tasks"
                  data={archivedTask}
                  open={archiveOpen}
                  setOpen={setArchiveOpen}
                />
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
            {conversationDetails ? (
              <Button
                variant={"outline"}
                className="flex-grow"
                onClick={() => {
                  router.push("/dashboard/messages");
                  setSelectedRoom(id);
                }}
              >
                <MessageCircle />
                Messages
              </Button>
            ) : (
              <Button
                variant={"outline"}
                className="flex-grow"
                onClick={() => {
                  createNewChat({
                    teamId: id,
                    type: "team",
                  });
                }}
                disabled={isPending}
              >
                {!isPending ? (
                  <>
                    <MessageCirclePlus />
                    Initialize
                  </>
                ) : (
                  <>
                    <LoaderCircle className="animate-spin" /> Intializing
                  </>
                )}
              </Button>
            )}
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
