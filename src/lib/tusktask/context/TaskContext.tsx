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
import { fetchTaskDetail } from "../fetchers/fetchTaskDetail";
import { DetailTaskKey } from "../server/fetchers/fetchTaskData";
import { DetailTask } from "@/src/types/task";
import { StandardResponse } from "../utils/createResponse";
import TaskControlPanelDialog from "@/src/ui/components/tusktask/prefabs/TaskControlPanelDialog";
import InformationDialog from "@/src/ui/components/tusktask/prefabs/InformationDialog";
import BudgetDialog from "@/src/ui/components/tusktask/prefabs/BudgetDialog";

export interface NewTaskDialogType {
  open: boolean;
  teamId: string | null;
  parentId: string | null;
  type: "task" | "shopping_list";
  parent: TaskType | null;
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

  // Detail Task Data
  detailTask: DetailTask | undefined;
  detailTaskResponse?: StandardResponse<DetailTask | null>;
  detailTaskKey: DetailTaskKey | null;
  setDetailTaskKey: SetStateAction<DetailTaskKey | null>;

  // Task Update Mutation
  updateTask: MutateFunction<TaskType | null, TasksPatchRequest>;
  isUpdatingTask: boolean;
  isErrorUpdatingTask: boolean;

  // Task Control Panel Dialog
  taskControlPanelDialog: TaskControlPanelDialog;
  setTaskControlPanelDialog: SetStateAction<TaskControlPanelDialog>;
  handleResetTaskControlPanelDialog: () => void;

  // Information Dialog
  informationDialog: TaskControlPanelDialogWithTrigger;
  setInformationDialog: SetStateAction<TaskControlPanelDialogWithTrigger>;
  handleResetInformationDialog: () => void;

  // Budget Dialog
  budgetDialog: TaskControlPanelDialogWithTrigger;
  setBudgetDialog: SetStateAction<TaskControlPanelDialogWithTrigger>;
  handleResetBudgetDialog: () => void;

  // Reschedule Dialog
  reScheduleDialog: TaskControlPanelDialogWithTrigger;
  setReScheduleDialog: SetStateAction<TaskControlPanelDialogWithTrigger>;
  handleResetReScheduleDialog: () => void;

  // Helper State
  parentKey: string | null;
  setParentKey: SetStateAction<string | null>;
}

export interface TaskControlPanelDialog {
  task: TaskType | null;
  open: boolean;
}

export interface TaskControlPanelDialogWithTrigger
  extends TaskControlPanelDialog {
  trigger?: "control_panel";
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
    parent: null,
  };

  const [newTaskDialog, setNewTaskDialog] =
    useState<NewTaskDialogType>(newTaskDialogInitial);

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
  const [parentKey, setParentKey] = useState<string | null>(null);
  const {
    mutate: updateTask,
    isPending: isUpdatingTask,
    isError: isErrorUpdatingTask,
  } = useUpdateTask(
    {
      queryClient,
      teamDetailKey,
    },
    parentKey,
    setParentKey
  );

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

  // Fetch Detail Task
  const [detailTaskKey, setDetailTaskKey] = useState<DetailTaskKey | null>(
    null
  );
  const { data: detailTaskResponse, isLoading: isLoadingDetailTask } = useQuery(
    {
      queryKey: [...(detailTaskKey?.keys ?? [])],
      queryFn: () => fetchTaskDetail({ id: detailTaskKey?.taskId! }),
      enabled: !!detailTaskKey,
    }
  );

  const detailTask = detailTaskResponse?.data ?? undefined;

  // Task Control Panel
  const initialTaskControlPanelDialog: TaskControlPanelDialog = {
    open: false,
    task: null,
  };
  const [taskControlPanelDialog, setTaskControlPanelDialog] =
    useState<TaskControlPanelDialog>(initialTaskControlPanelDialog);

  const handleResetTaskControlPanelDialog = () => {
    setTaskControlPanelDialog(initialTaskControlPanelDialog);
  };

  // Task Information Panel
  const [informationDialog, setInformationDialog] =
    useState<TaskControlPanelDialogWithTrigger>(initialTaskControlPanelDialog);

  const handleResetInformationDialog = () => {
    setInformationDialog(initialTaskControlPanelDialog);
  };

  // Task Budget Panel
  const [budgetDialog, setBudgetDialog] =
    useState<TaskControlPanelDialogWithTrigger>(initialTaskControlPanelDialog);

  const handleResetBudgetDialog = () => {
    setBudgetDialog(initialTaskControlPanelDialog);
  };

  // Reschedule Dialog

  const [reScheduleDialog, setReScheduleDialog] =
    useState<TaskControlPanelDialogWithTrigger>(initialTaskControlPanelDialog);

  const handleResetReScheduleDialog = () =>
    setReScheduleDialog(initialTaskControlPanelDialog);

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

        // Detail Task Data
        detailTask,
        detailTaskResponse,
        detailTaskKey,
        setDetailTaskKey,

        // ReScheduleDialog
        reScheduleDialog,
        setReScheduleDialog,
        handleResetReScheduleDialog,

        // Task Update Mutation
        updateTask,
        isErrorUpdatingTask,
        isUpdatingTask,

        // Task Control Panel Dialog
        taskControlPanelDialog,
        setTaskControlPanelDialog,
        handleResetTaskControlPanelDialog,

        // Task Information dialog
        informationDialog,
        setInformationDialog,
        handleResetInformationDialog,

        // Task Budget Dialog
        budgetDialog,
        setBudgetDialog,
        handleResetBudgetDialog,

        // Helper State
        parentKey,
        setParentKey,
      }}
    >
      {children}
      <NewTaskDialog />
      <ReScheduleDialog />
      <TaskControlPanelDialog />
      <InformationDialog />
      <BudgetDialog />
    </TaskContext.Provider>
  );
};

export { TaskContext, TaskContextProvider };
