import { create } from "zustand";
import type { ButtonProps } from "../ui/shadcn/components/ui/button";

export type ConfirmationDialogData = {
  title: string;
  desc: string;
  confirmationText?: string;
  positiveButtonProps?: ButtonProps;
  negativeButtonProps?: ButtonProps;
};

export interface ConfirmationDialogStore {
  data: ConfirmationDialogData | null;
  openDialog: (data: ConfirmationDialogData) => void;
  reset: () => void;
}

export const useConfirmationDialog = create<ConfirmationDialogStore>((set) => ({
  data: null,
  openDialog: (data) => set({ data }),
  reset: () => set({ data: null }),
}));
