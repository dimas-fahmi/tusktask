import { create } from "zustand";

export const DEFAULT_POMODORO_FOCUS_TIME = 1000 * 60 * 25; // 25 minutes
export const DEFAULT_POMODORO_REST_TIME = 1000 * 60 * 5; // 5 minutes

export interface PomodoroStore {
  dialogOpen: boolean;
  setDialogOpen: (dialogOpen: boolean) => void;

  currentPhase: "focus" | "rest";
  setCurrentPhase: (currentPhase: PomodoroStore["currentPhase"]) => void;

  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;

  isStarted: boolean;
  setIsStarted: (isStarted: boolean) => void;

  elapsedTime: number;
  setElapsedTime: (elapsedTime: number) => void;

  focusTime: number;
  setFocusTime: (focusTime: number) => void;

  restTime: number;
  setRestTime: (restTime: number) => void;

  reset: () => void;
}

export const PomodoroStoreDefault = {
  isRunning: false,
  isStarted: false,
  currentPhase: "focus",
  elapsedTime: 0,
} as const;

export const usePomodoroStore = create<PomodoroStore>((set) => ({
  dialogOpen: false,
  setDialogOpen: (dialogOpen) => set({ dialogOpen }),

  isRunning: false,
  setIsRunning: (isRunning: boolean) => set({ isRunning }),

  isStarted: false,
  setIsStarted: (isStarted) => set({ isStarted }),

  currentPhase: "focus",
  setCurrentPhase: (currentPhase) => set({ currentPhase }),

  elapsedTime: 0,
  setElapsedTime: (elapsedTime) => set({ elapsedTime }),

  focusTime: DEFAULT_POMODORO_FOCUS_TIME,
  setFocusTime: (focusTime) => set({ focusTime }),

  restTime: DEFAULT_POMODORO_REST_TIME,
  setRestTime: (restTime) => set({ restTime }),

  reset: () => set({ ...PomodoroStoreDefault }),
}));
