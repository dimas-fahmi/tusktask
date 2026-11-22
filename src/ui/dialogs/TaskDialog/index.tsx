"use client";

import {
  IconChevronDown,
  IconCircle,
  IconDots,
  IconPlus,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "cn";
import { motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useTaskDialog } from "@/src/hooks/useTaskDialog";
import { useTRPC } from "@/src/lib/trpc/client/client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../shadcn/components/ui/avatar";
import { Button } from "../../shadcn/components/ui/button";
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

const ControlSection = ({
  children,
  title,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  title?: string;
}) => {
  const [expand, setExpand] = useState(true);

  return (
    <div
      {...props}
      className={cn("space-y-2 grid grid-cols-1", props?.className)}
    >
      <button
        type="button"
        className="text-center flex items-center justify-between gap-4"
        onClick={() => {
          setExpand(!expand);
        }}
      >
        <h2 className="uppercase text-xs font-semibold opacity-50">{title}</h2>

        <IconChevronDown
          className={cn(
            "w-4 h-4 transition-all duration-200",
            expand ? "rotate-180" : "rotate-0",
          )}
          stroke={1}
        />
      </button>

      <motion.div
        initial={{
          height: "auto",
        }}
        animate={expand ? { height: "auto" } : { height: 0 }}
        className="overflow-hidden"
      >
        {children}
      </motion.div>
    </div>
  );
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
    <div className="space-y-2">
      {/* Control Bar */}
      <TaskDialogControlBar setOpen={setOpen} taskDetail={taskDetail} />

      {/* Main */}
      <div className="md:grid md:grid-cols-[auto_270px] gap-4 p-4">
        {/* Main Task Platform */}
        <div className="grid grid-cols-1 gap-6">
          {/* Top Side */}
          <div className="space-y-2">
            {/* Task Name */}
            <div className="flex items-center gap-4">
              <button type="button">
                <IconCircle />
              </button>

              <h1 className="text-xl font-bold">{taskDetail?.name}</h1>
            </div>

            {/* Task Description */}
            <div className="min-h-[120px] opacity-70">
              {taskDetail?.description || "No description"}
            </div>
          </div>

          {/* Subtasks */}
          <div className="grid grid-cols-1">
            <Button
              variant={"ghost"}
              size={"sm"}
              className={
                "justify-start opacity-70 not-disabled:hover:opacity-100"
              }
            >
              <IconPlus /> <span>New Subtask</span>
            </Button>
          </div>

          <Button
            variant={"outline"}
            className={"flex md:hidden"}
            onClick={() => {
              setOpen(false);
            }}
          >
            Close
          </Button>
        </div>

        {/* Sidebar Information */}
        <div className="hidden md:flex flex-col gap-4">
          {/* Owner */}
          <ControlSection title="Owner">
            <div className="flex items-center gap-2 p-2 border rounded-md">
              <Avatar>
                {taskDetail?.user?.image && (
                  <AvatarImage src={taskDetail.user.image} />
                )}
                <AvatarFallback>
                  {taskDetail?.user?.name?.[0] || "N/A"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 flex items-center justify-between">
                <div>
                  <h3>{taskDetail?.user?.name}</h3>
                  <p className="text-xs font-light opacity-70">
                    {taskDetail?.user?.username}
                  </p>
                </div>

                <Button variant={"ghost"} size={"icon-xs"} disabled>
                  <IconDots />
                </Button>
              </div>
            </div>
          </ControlSection>

          {/* Start At */}
          <ControlSection title="Start">
            <span>Not Set</span>
          </ControlSection>

          {/* Deadline At */}
          <ControlSection title="Deadline">
            <span>Not Set</span>
          </ControlSection>

          {/* Priority */}
          <ControlSection title="Priority">
            <span>Not Set</span>
          </ControlSection>
        </div>
      </div>
    </div>
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
