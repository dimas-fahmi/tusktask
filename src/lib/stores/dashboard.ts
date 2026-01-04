import { Blocks, Calendar, Columns3, type LucideIcon } from "lucide-react";
import { create } from "zustand";

export const VIEWS = ["day-by-day", "columns", "calendar"] as const;

export const VIEWS_METADATA: Record<
  (typeof VIEWS)[number],
  { icon: LucideIcon; label: string }
> = {
  "day-by-day": {
    icon: Blocks,
    label: "Day by Day",
  },
  calendar: {
    icon: Calendar,
    label: "Calendar",
  },
  columns: {
    icon: Columns3,
    label: "Columns",
  },
};

export interface DashboardStore {
  activeView: (typeof VIEWS)[number];
  setActiveView: (view: DashboardStore["activeView"]) => void;

  viewPickerModalOpen: boolean;
  setViewPickerModalOpen: (open: boolean) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  activeView: "day-by-day",
  setActiveView: (nv) => set({ activeView: nv }),

  viewPickerModalOpen: false,
  setViewPickerModalOpen: (nv) => set({ viewPickerModalOpen: nv }),
}));
