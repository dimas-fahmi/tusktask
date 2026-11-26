"use client";

import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { useShallow } from "zustand/react/shallow";
import { useTaskDialog } from "@/src/hooks/useTaskDialog";
import { useTRPC } from "@/src/lib/trpc/client/client";
import type { GetTaskDetailProcResult } from "@/src/lib/trpc/router/task/getTaskDetail";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../shadcn/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../../shadcn/components/ui/drawer";
import { useIsMobile } from "../../shadcn/hooks/use-mobile";
import TaskDialogControlBar from "./TaskDialogControlBar";
import TaskDialogInfo from "./TaskDialogInfo";
import TaskDialogMainPanel from "./TaskDialogMainPanel";

export interface TaskDialogContext {
  taskDetail: GetTaskDetailProcResult;
  setOpen: (open: boolean) => void;
}

const TaskDialogContext = createContext<TaskDialogContext | null>(null);

export const useTaskDialogCtx = () => {
  const ctx = useContext(TaskDialogContext);

  if (!ctx) {
    throw new Error(
      "TaskDialogContext is undefined, this hook could only be use inside TaskDialogContext.Provider",
    );
  }

  return ctx;
};

const Body = () => {
  const [taskId, setOpen] = useTaskDialog(
    useShallow((s) => [s.taskId, s.onOpenChange]),
  );

  const trpc = useTRPC();

  const { data: taskDetail, isPending: _ } = useQuery({
    ...trpc.task.getTaskDetail.queryOptions({ taskId: taskId ?? "" }),
    enabled: !!taskId,
  });

  return taskDetail ? (
    <TaskDialogContext.Provider
      value={{
        taskDetail,
        setOpen,
      }}
    >
      <div className="space-y-2">
        {/* Control Bar */}
        <TaskDialogControlBar />

        {/* Main */}
        <div className="md:grid md:grid-cols-[auto_280px] gap-4 p-4">
          {/* Main Task Panel */}
          <TaskDialogMainPanel />

          {/* Sidebar Information */}
          <div className="hidden md:flex flex-col gap-4">
            <TaskDialogInfo />
          </div>
        </div>
      </div>
    </TaskDialogContext.Provider>
  ) : (
    <div>Loading...</div>
  );
};

const TaskDialog = () => {
  const isMobile = useIsMobile();

  const [open, onOpenChange] = useTaskDialog(
    useShallow((s) => [s.open, s.onOpenChange]),
  );

  const title = "Task Name";
  const desc = "task desc";

  return isMobile ? (
    <Drawer {...{ open, onOpenChange }}>
      <DrawerContent>
        <DrawerHeader className="sr-only">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{desc}</DrawerDescription>
        </DrawerHeader>

        <Body />
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog {...{ open, onOpenChange }}>
      <DialogContent
        className={
          "min-w-[760px] max-w-[760px] min-h-[75vh] max-h-[75vh] p-0 overflow-hidden"
        }
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>

        <Body />
      </DialogContent>
    </Dialog>
  );
};
export default TaskDialog;
