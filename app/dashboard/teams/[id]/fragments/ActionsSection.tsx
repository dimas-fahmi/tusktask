import React from "react";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { CirclePlus } from "lucide-react";
import useTaskContext from "@/src/lib/tusktask/hooks/context/useTaskContext";
import useTeamContext from "@/src/lib/tusktask/hooks/context/useTeamContext";
import { usePermission } from "@/src/lib/tusktask/hooks/membership/usePermission";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import { TOAST_MANAGEMENT_ONLY } from "@/src/lib/tusktask/constants/configs";

const ActionsSection = ({ teamId }: { teamId: string }) => {
  // Pull setters from task context
  const { setNewTaskDialog } = useTaskContext();

  // Pull Team context
  const { myMembership } = useTeamContext();

  // Get Permission
  const { canCreateTask } = usePermission(myMembership);

  // Pull notification context
  const { triggerToast } = useNotificationContext();

  return (
    <section id="action" className="w-full gap-2 flex">
      <Button
        variant={"outline"}
        className={`flex-grow ${!canCreateTask ? "opacity-50" : ""}`}
        title={
          canCreateTask
            ? "Create new task"
            : "Only administrator can perform this operation"
        }
        size={"default"}
        onClick={() => {
          if (!canCreateTask) {
            triggerToast({ ...TOAST_MANAGEMENT_ONLY, type: "default" });
            return;
          }

          setNewTaskDialog({
            open: true,
            teamId: teamId,
            parentId: null,
            type: "task",
          });
        }}
      >
        <CirclePlus />
        Task
      </Button>
      <Button
        variant={"outline"}
        title={
          canCreateTask
            ? "Create shopping list"
            : "Only administrator can perform this operation"
        }
        onClick={() => {
          if (!canCreateTask) {
            triggerToast({ ...TOAST_MANAGEMENT_ONLY, type: "default" });
            return;
          }
          setNewTaskDialog({
            open: true,
            teamId: teamId,
            parentId: null,
            type: "shopping_list",
          });
        }}
        size={"default"}
        className={`flex-grow ${!canCreateTask ? "opacity-50" : ""}`}
      >
        <CirclePlus />
        Shopping List
      </Button>
    </section>
  );
};

export default ActionsSection;
