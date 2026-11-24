import type { BaseUIEvent } from "@base-ui/react";
import type { SyntheticEvent } from "react";
import { create } from "zustand";

export interface DatePickerDialogData {
  title: string;
  description?: string;
  label?: string;
  min?: Date | null | undefined;
  max?: Date | null | undefined;
  callbacks?: {
    positive?: (
      date: Date,
      e: BaseUIEvent<SyntheticEvent<HTMLButtonElement, MouseEvent>>,
    ) => void;
    negative?: (
      e: BaseUIEvent<SyntheticEvent<HTMLButtonElement, MouseEvent>>,
    ) => void;
  };
}

export interface DatePickerDialog {
  data: DatePickerDialogData | null;
  setData: (data: DatePickerDialog["data"]) => void;

  openDialog: (data: DatePickerDialogData) => void;
}

export const useDatePickerDialog = create<DatePickerDialog>((set) => ({
  data: null,
  setData: (data) => set({ data }),

  openDialog: (data) => set({ data }),
}));
