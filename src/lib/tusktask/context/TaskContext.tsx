import { MutateFunction, SetStateAction } from "@/src/types/types";
import NewTaskDialog from "@/src/ui/components/tusktask/prefabs/NewTaskDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useState } from "react";
import { fetchPersonalTasks } from "../fetchers/fetchPersonalTasks";
import { TaskType } from "@/src/db/schema/tasks";
import { TaskWithSubtasks } from "@/app/api/tasks/get";
import categorizeTask, {
  CategorizeTaskOutput,
} from "../categorizer/categorizeTask";
import { deleteTask as mutateDeleteTask } from "../mutators/deleteTask";
import { TasksDeleteRequest } from "@/app/api/tasks/delete";
import useNotificationContext from "../hooks/context/useNotificationContext";
import { useUpdateTask } from "../mutation/taskMutation";
import useTeamContext from "../hooks/context/useTeamContext";
import { TasksPatchRequest } from "@/app/api/tasks/patch";
import ReScheduleDialog from "@/src/ui/components/tusktask/prefabs/ReScheduleDialog";

export interface NewTaskDialogType {
  open: boolean;
  teamId: string | null;
  parentId: string | null;
  type: "task" | "shopping_list";
}

export interface TaskContextValues {
  newTaskDialog: NewTaskDialogType;
  setNewTaskDialog: SetStateAction<NewTaskDialogType>;
  handleResetNewTaskDialog: () => void;
  tasks: TaskType[] | TaskWithSubtasks[] | null | undefined;
  isFetchingTasks: boolean;
  categorizedTasks: CategorizeTaskOutput<TaskWithSubtasks>;
  deleteTask: MutateFunction<TaskType | null, TasksDeleteRequest>;
  isDeletingTask: boolean;
  taskDeleteKey: string | null;
  setTaskDeleteKey: SetStateAction<string | null>;
  updateTask: MutateFunction<TaskType | null, TasksPatchRequest>;
  reScheduleDialog: ReScheduleDialog;
  setReScheduleDialog: SetStateAction<ReScheduleDialog>;
  handleResetReScheduleDialog: () => void;
}

export interface ReScheduleDialog {
  open: boolean;
  task: TaskType | null;
}

const TaskContext = createContext<TaskContextValues | null>(null);

const TaskContextProvider = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  // New Task Dialog
  const newTaskDialogInitial: NewTaskDialogType = {
    open: false,
    teamId: null,
    parentId: null,
    type: "task",
  };
  const [newTaskDialog, setNewTaskDialog] =
    useState<NewTaskDialogType>(newTaskDialogInitial);

  // Reschedule Dialog
  const reScheduleDialogInitial: ReScheduleDialog = {
    open: false,
    task: null,
  };
  const [reScheduleDialog, setReScheduleDialog] = useState<ReScheduleDialog>(
    reScheduleDialogInitial
  );

  const handleResetReScheduleDialog = () =>
    setReScheduleDialog(reScheduleDialogInitial);

  // Query Tasks
  const { data: tasksResponse, isFetching: isFetchingTasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () =>
      fetchPersonalTasks({ withSubtasks: "true", onlyTopLevel: "true" }),
  });

  // Query Client
  const queryClient = useQueryClient();

  // Pull triggers from notification context
  const { triggerToast } = useNotificationContext();

  // Mutation [delete task]
  const [taskDeleteKey, setTaskDeleteKey] = useState<string | null>(null);
  const { mutate: deleteTask, isPending: isDeletingTask } = useMutation({
    mutationFn: mutateDeleteTask,
    onMutate: () => {
      triggerToast({
        type: "default",
        title: "Deleting Task",
        description: "Please wait a second",
      });
    },
    onError: () => {
      triggerToast({
        type: "error",
        title: "Something Went Wrong",
        description: "Failed to delete task",
      });

      setTaskDeleteKey(null);
    },
    onSuccess: () => {
      triggerToast({
        type: "success",
        title: "Task Deleted",
        description: "Task successfully deleted",
      });
    },
    onSettled: (data, error, request) => {
      queryClient.invalidateQueries({
        queryKey: ["team", request.teamId],
      });

      queryClient.invalidateQueries({
        queryKey: ["task", request.taskId],
      });

      queryClient.invalidateQueries({
        queryKey: ["teams"],
      });
    },
  });

  // Pull team context
  const { teamDetailKey } = useTeamContext();

  // Mutation [update task]
  const { mutate: updateTask } = useUpdateTask({ queryClient, teamDetailKey });

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
        deleteTask,
        taskDeleteKey,
        setTaskDeleteKey,
        isDeletingTask,
        updateTask,

        // ReScheduleDialog
        reScheduleDialog,
        setReScheduleDialog,
        handleResetReScheduleDialog,
      }}
    >
      {children}
      <NewTaskDialog />
      <ReScheduleDialog />
    </TaskContext.Provider>
  );
};

export { TaskContext, TaskContextProvider };
