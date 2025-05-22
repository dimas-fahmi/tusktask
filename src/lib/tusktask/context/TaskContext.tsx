import { SetStateAction } from "@/src/types/types";
import NewTaskDialog from "@/src/ui/components/tusktask/prefabs/NewTaskDialog";
import { createContext, useEffect, useState } from "react";

export interface NewTaskDialogOpenType {
  open: boolean;
  teamId: string | null;
  parentId: string | null;
}

export interface TaskContextValues {
  newTaskDialog: NewTaskDialogOpenType;
  setNewTaskDialog: SetStateAction<NewTaskDialogOpenType>;
  handleResetNewTaskDialog: () => void;
}

const TaskContext = createContext<TaskContextValues | null>(null);

const TaskContextProvider = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  // New Task Dialog
  const newTaskDialogInitial = {
    open: false,
    teamId: null,
    parentId: null,
  };
  const [newTaskDialog, setNewTaskDialog] = useState<NewTaskDialogOpenType>({
    open: false,
    teamId: null,
    parentId: null,
  });

  // Reset everytime newTaskDialog open set to false
  const handleResetNewTaskDialog = () => {
    setNewTaskDialog(newTaskDialogInitial);
  };

  return (
    <TaskContext.Provider
      value={{ newTaskDialog, setNewTaskDialog, handleResetNewTaskDialog }}
    >
      {children}
      <NewTaskDialog />
    </TaskContext.Provider>
  );
};

export { TaskContext, TaskContextProvider };
