import useTaskContext from "@/src/lib/tusktask/hooks/context/useTaskContext";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { useSidebar } from "@/src/ui/components/shadcn/ui/sidebar";
import { CirclePlus, MessageCircle, PanelRightOpen } from "lucide-react";
import React from "react";

const HeaderNavigation = () => {
  // Pull setter from sidebar context
  const { setOpen } = useSidebar();

  // Pull setters from Task context
  const { setNewTaskDialog } = useTaskContext();

  return (
    <div className="grid grid-cols-1 gap-2">
      <Button
        onClick={() =>
          setNewTaskDialog({
            open: true,
            teamId: null,
            parentId: null,
            type: "task",
          })
        }
      >
        <CirclePlus />
        New Task
      </Button>
      <div className="grid grid-cols-2 gap-2">
        <Button variant={"outline"}>
          <MessageCircle /> Messages
        </Button>
        <Button variant={"outline"} onClick={() => setOpen(false)}>
          <PanelRightOpen />
          Hide
        </Button>
      </div>
    </div>
  );
};

export default HeaderNavigation;
