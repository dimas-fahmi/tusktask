"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shadcn/ui/dialog";
import useTaskContext from "@/src/lib/tusktask/hooks/context/useTaskContext";
import {
  CalendarSync,
  HandCoins,
  MessageCircle,
  Settings,
  SquarePen,
} from "lucide-react";
import { Button } from "../../../shadcn/ui/button";
import PanelCard from "./PanelCard";

const TaskControlPanelDialog = () => {
  // Pull Task context values
  const {
    taskControlPanelDialog,
    handleResetTaskControlPanelDialog,
    setInformationDialog,
    setBudgetDialog,
    setReScheduleDialog,
  } = useTaskContext();

  const { task, open } = taskControlPanelDialog;

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          handleResetTaskControlPanelDialog();
        }
      }}
    >
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-xl font-bold flex items-center gap-1.5">
            <Settings />
            Control Panel
          </DialogTitle>
          <DialogDescription className="text-sm">
            Control panel to manage and update task
          </DialogDescription>
        </DialogHeader>

        {/* Panel */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Panel Card */}
          <PanelCard
            Icon={SquarePen}
            label="Information"
            onClick={() => {
              if (!task) return;
              setInformationDialog({
                task: task,
                open: true,
                trigger: "control_panel",
              });
              handleResetTaskControlPanelDialog();
            }}
          />
          <PanelCard
            Icon={HandCoins}
            label="Budget"
            onClick={() => {
              if (!task) return;
              setBudgetDialog({
                task: task,
                open: true,
                trigger: "control_panel",
              });
              handleResetTaskControlPanelDialog();
            }}
          />
          <PanelCard
            Icon={CalendarSync}
            label="Reschedule"
            onClick={() => {
              setReScheduleDialog({
                open: true,
                task: task,
                trigger: "control_panel",
              });
            }}
          />
          <PanelCard Icon={MessageCircle} label="Team Chat" />
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button
            variant={"outline"}
            onClick={() => {
              handleResetTaskControlPanelDialog();
            }}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskControlPanelDialog;
