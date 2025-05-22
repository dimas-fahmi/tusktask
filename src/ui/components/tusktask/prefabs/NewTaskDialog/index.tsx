import useTaskContext from "@/src/lib/tusktask/hooks/context/useTaskContext";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../../shadcn/ui/dialog";

const NewTaskDialog = () => {
  // Pull states from TaskContext
  const { newTaskDialog, setNewTaskDialog, handleResetNewTaskDialog } =
    useTaskContext();

  // Open State
  const [open, setOpen] = useState(false);

  // Synchronize open state with newTaskDialog state object
  useEffect(() => {
    if (newTaskDialog) {
      setOpen(newTaskDialog.open);
    }
  }, [newTaskDialog]);

  useEffect(() => {
    if (!open) {
      handleResetNewTaskDialog();
    }
  }, [open]);

  return (
    <Dialog open={newTaskDialog.open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>New Task Dialog</DialogTitle>
        <DialogDescription>Create new task with this dialog</DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskDialog;
