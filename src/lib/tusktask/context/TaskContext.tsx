import { SetStateAction } from "@/src/types/types";
import NewTaskDialog from "@/src/ui/components/tusktask/prefabs/NewTaskDialog";
import { useQuery } from "@tanstack/react-query";
import { createContext, useState } from "react";
import { fetchPersonalTasks } from "../fetchers/fetchPersonalTasks";
import { TaskType } from "@/src/db/schema/tasks";
import { TaskWithSubtasks } from "@/app/api/tasks/get";
import categorizeTask, {
  CategorizeTaskOutput,
} from "../categorizer/categorizeTask";

export interface NewTaskDialogOpenType {
  open: boolean;
  teamId: string | null;
  parentId: string | null;
}

export interface TaskContextValues {
  newTaskDialog: NewTaskDialogOpenType;
  setNewTaskDialog: SetStateAction<NewTaskDialogOpenType>;
  handleResetNewTaskDialog: () => void;
  tasks: TaskType[] | TaskWithSubtasks[] | null | undefined;
  isFetchingTasks: boolean;
  categorizedTasks: CategorizeTaskOutput<TaskWithSubtasks>;
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

  // Query Tasks
  const { data: tasksResponse, isFetching: isFetchingTasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () =>
      fetchPersonalTasks({ withSubtasks: "true", onlyTopLevel: "true" }),
  });

  // Extract Tasks
  const tasks = tasksResponse?.data;

  // Categorized Tasks
  const categorizedTasks = categorizeTask<TaskWithSubtasks>({
    tasks: tasks as TaskWithSubtasks[],
    field: "deadlineAt",
  });

  // Reset everytime newTaskDialog open set to false
  const handleResetNewTaskDialog = () => {
    setNewTaskDialog(newTaskDialogInitial);
  };

  return (
    <TaskContext.Provider
      value={{
        newTaskDialog,
        setNewTaskDialog,
        handleResetNewTaskDialog,
        tasks,
        isFetchingTasks,
        categorizedTasks,
      }}
    >
      {children}
      <NewTaskDialog />
    </TaskContext.Provider>
  );
};

export { TaskContext, TaskContextProvider };
