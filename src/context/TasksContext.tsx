import { TasksGetApiData } from "@/app/api/tasks/types";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { createContext } from "react";
import { fetchMyTasks } from "../lib/tusktask/fetchers/fetchMyTasks";
import { useCategorizeTasks } from "../lib/tusktask/hooks/data/useCategorizeTasks";

export interface TasksContextValue {
  overdue: TasksGetApiData[];
  today: TasksGetApiData[];
  tomorrow: TasksGetApiData[];
  todo: TasksGetApiData[];
  completed: TasksGetApiData[];
}

export const TasksContext = createContext<TasksContextValue | null>(null);

export const TasksContextProvider = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  const { data: session } = useSession();

  const { data, isFetching } = useQuery({
    queryKey: ["tasks", "personal"],
    queryFn: () => {
      return fetchMyTasks({ ownerId: session?.user.id });
    },
    enabled: !!session,
  });

  const { completed, overdue, today, todo, tomorrow } = useCategorizeTasks(
    data && Array.isArray(data.data) ? data.data : null
  );

  return (
    <TasksContext.Provider
      value={{ completed, overdue, today, todo, tomorrow }}
    >
      {children}
    </TasksContext.Provider>
  );
};
