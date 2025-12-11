import { Circle } from "lucide-react";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "@/src/ui/shadcn/components/ui/context-menu";
import TaskCardContextMenu from "./TaskCardContextMenu";

const TaskCard = () => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="min-h-38 max-h-38 flex flex-col gap-2 shadow-md p-4 rounded-2xl border cursor-pointer hover:scale-95 active:scale-90 transition-all duration-300">
          <header className="flex items-center gap-2">
            {/* Scratch Button */}
            <div>
              <Circle className="w-5 h-5" />
            </div>

            {/* Task Name */}
            <h1>Wash Jajang's Car</h1>
          </header>

          {/* Description */}
          <p className="text-sm flex-1 opacity-70 font-light">No description</p>

          {/* Footer */}
          <footer className="border-t pt-1">
            <span className="text-xs">In 2 days</span>
          </footer>
        </div>
      </ContextMenuTrigger>
      <TaskCardContextMenu />
    </ContextMenu>
  );
};

export default TaskCard;
