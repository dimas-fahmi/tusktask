import {
  SpecificTask,
  TasksGetApiData,
  TasksGetApiResponse,
} from "@/app/api/tasks/types";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { createContext, useEffect, useState } from "react";
import { fetchMyTasks } from "../lib/tusktask/fetchers/fetchMyTasks";
import { useCategorizeTasks } from "../lib/tusktask/hooks/data/useCategorizeTasks";
import NewTaskDialog from "../ui/components/shadcn/dialogs/NewTaskDialog";
import TaskTimeUpdateDialog from "../ui/components/tusktask/dialogs/TaskTimeUpdateDialog";

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
  data: TasksGetApiResponse | undefined;
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
  const { data, isFetching } = useQuery({
    queryKey: ["tasks", "personal"],
    queryFn: () => {
      return fetchMyTasks({ ownerId: session?.user.id });
    },
    enabled: !!session,
  });

  const { completed, overdue, today, upcoming, tomorrow } = useCategorizeTasks(
    data && Array.isArray(data.data) ? data.data : null
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
        data,
        isFetching,
        taskTimeUpdateDialogOpen,
        setTaskTimeUpdateDialogOpen,
        specificTask,
        setSpecificTask,
        isPomodoroTask,
        setIsPomodoroTask,
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
