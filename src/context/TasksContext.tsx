import {
  SpecificTask,
  TasksGetApiData,
  TasksGetApiResponse,
} from "@/app/api/tasks/types";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { createContext, useEffect, useState } from "react";
import { useCategorizeTasks } from "../lib/tusktask/hooks/data/useCategorizeTasks";
import NewTaskDialog from "../ui/components/shadcn/dialogs/NewTaskDialog";
import TaskTimeUpdateDialog from "../ui/components/tusktask/dialogs/TaskTimeUpdateDialog";
import { fetchFilteredTasks } from "../lib/tusktask/fetchers/fetchFilteredTasks";

export interface TasksContextValue {
  overdue: TasksGetApiData[];
  today: TasksGetApiData[];
  tomorrow: TasksGetApiData[];
  upcoming: TasksGetApiData[];
  completed: TasksGetApiData[];
  newTaskDialogOpen: boolean;
  setNewTaskDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  taskTimeUpdateDialogOpen: boolean;
  setTaskTimeUpdateDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  specificTask: SpecificTask | null;
  setSpecificTask: React.Dispatch<React.SetStateAction<SpecificTask | null>>;
  personal: TasksGetApiResponse | undefined;
  trash: TasksGetApiResponse | undefined;
  isFetching: boolean;
  isPomodoroTask: boolean;
  setIsPomodoroTask: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TasksContext = createContext<TasksContextValue | null>(null);

export const TasksContextProvider = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  const { data: session } = useSession();

  // Dialog States
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [taskTimeUpdateDialogOpen, setTaskTimeUpdateDialogOpen] =
    useState(false);

  // SpecificTask State
  const [specificTask, setSpecificTask] = useState<SpecificTask | null>(null);

  // Pomodoro Mode Task
  const [isPomodoroTask, setIsPomodoroTask] = useState(false);

  // Global Query
  const { data: personal, isFetching } = useQuery({
    queryKey: ["tasks", "personal"],
    queryFn: () => {
      return fetchFilteredTasks({
        status: "not_started",
        ownerId: session?.user.id,
      });
    },
    enabled: !!session,
  });

  // Trash Bin Query
  const { data: trash } = useQuery({
    queryKey: ["tasks", "trash"],
    queryFn: () => {
      return fetchFilteredTasks({
        ownerId: session?.user.id,
        deletedAt: true,
      });
    },
    enabled: !!session,
  });

  const { completed, overdue, today, upcoming, tomorrow } = useCategorizeTasks(
    personal && Array.isArray(personal.data) ? personal.data : null
  );

  // Listen to newTaskDialogOpen
  useEffect(() => {
    if (!newTaskDialogOpen) {
      setIsPomodoroTask(false);
    }
  }, [newTaskDialogOpen]);

  return (
    <TasksContext.Provider
      value={{
        completed,
        overdue,
        today,
        upcoming,
        tomorrow,
        setNewTaskDialogOpen,
        newTaskDialogOpen,
        personal,
        isFetching,
        taskTimeUpdateDialogOpen,
        setTaskTimeUpdateDialogOpen,
        specificTask,
        setSpecificTask,
        isPomodoroTask,
        setIsPomodoroTask,
        trash,
      }}
    >
      {children}
      <NewTaskDialog open={newTaskDialogOpen} setOpen={setNewTaskDialogOpen} />
      <TaskTimeUpdateDialog
        open={taskTimeUpdateDialogOpen}
        setOpen={setTaskTimeUpdateDialogOpen}
      />
    </TasksContext.Provider>
  );
};
