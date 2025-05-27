import React from "react";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { CirclePlus } from "lucide-react";
import useTaskContext from "@/src/lib/tusktask/hooks/context/useTaskContext";

const ActionsSection = ({ teamId }: { teamId: string }) => {
  // Pull setters from task context
  const { setNewTaskDialog } = useTaskContext();

  return (
    <section id="action" className="w-full gap-2 flex">
      <Button
        variant={"outline"}
        className="flex-grow"
        size={"default"}
        onClick={() =>
          setNewTaskDialog({
            open: true,
            teamId: teamId,
            parentId: null,
            type: "task",
          })
        }
      >
        <CirclePlus />
        Task
      </Button>
      <Button
        variant={"outline"}
        onClick={() =>
          setNewTaskDialog({
            open: true,
            teamId: teamId,
            parentId: null,
            type: "shopping_list",
          })
        }
        size={"default"}
        className="flex-grow"
      >
        <CirclePlus />
        Shopping List
      </Button>
    </section>
  );
};

export default ActionsSection;
