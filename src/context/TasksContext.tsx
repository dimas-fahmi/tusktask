import { TasksGetApiData } from "@/app/api/tasks/types";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { createContext, useState } from "react";
import { fetchMyTasks } from "../lib/tusktask/fetchers/fetchMyTasks";
import { useCategorizeTasks } from "../lib/tusktask/hooks/data/useCategorizeTasks";
import NewTaskDialog from "../ui/components/shadcn/dialogs/NewTaskDialog";

export interface TasksContextValue {
  overdue: TasksGetApiData[];
  today: TasksGetApiData[];
  tomorrow: TasksGetApiData[];
  upcoming: TasksGetApiData[];
  completed: TasksGetApiData[];
  newTaskDialogOpen: boolean;
  setNewTaskDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TasksContext = createContext<TasksContextValue | null>(null);

export const TasksContextProvider = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  const { data: session } = useSession();

  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);

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
      }}
    >
      {children}
      <NewTaskDialog open={newTaskDialogOpen} setOpen={setNewTaskDialogOpen} />
    </TasksContext.Provider>
  );
};
