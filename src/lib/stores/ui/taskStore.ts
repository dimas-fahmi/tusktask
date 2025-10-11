import { Project } from "@/src/db/schema/projects";
import { create } from "zustand";
import { TaskApp } from "../../types/tasks";
import { Task } from "@/src/db/schema/tasks";

export interface TaskStore {
  // New Task Dialog State
  newTaskDialogOpen: boolean;
  setNewTaskDialogOpen: (n: boolean) => void;

  // reschedule
  rescheduleDialogOpen: boolean;
  setRescheduleDialogOpen: (n: boolean) => void;

  // Active Task
  activeTask?: TaskApp;
  setActiveTask: (n: TaskApp) => void;

  // Active Project State
  activeProject?: Project;
  setActiveProject: (n?: Project) => void;

  // Parent Task
  parentTask: Task | null;
  setParentTask: (n: Task | null) => void;

  // Resetter
  reset: () => void;
}

export const taskStoreDefaultValues = {
  newTaskDialogOpen: false,
  activeProject: undefined,
  rescheduleDialogOpen: false,
  activeTask: undefined,
  parentTask: null,
};

export const useTaskStore = create<TaskStore>((set) => ({
  ...taskStoreDefaultValues,

  // Setters
  setNewTaskDialogOpen: (n) => set({ newTaskDialogOpen: n }),
  setActiveProject: (n) => set({ activeProject: n }),
  setRescheduleDialogOpen: (n) => set({ rescheduleDialogOpen: n }),
  setActiveTask: (n) => set({ activeTask: n }),
  setParentTask: (n) => set({ parentTask: n }),

  // Resetter
  reset: () => set(taskStoreDefaultValues),
}));
