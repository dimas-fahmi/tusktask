import type { ExternalToast } from "sonner";
import { create } from "zustand";
import type { AUDIOS } from "@/app/NotificationProvider";

export type ToastType = "success" | "info" | "warning" | "error";

export type NotificationStore = {
  isReady: boolean;
  notificationStatus: NotificationPermission;
  triggerToast: (
    message: string,
    options?: ExternalToast,
    type?: ToastType,
  ) => void;
  triggerSound: (key: keyof typeof AUDIOS) => undefined | HTMLAudioElement;
  triggerNotification: (
    title: string,
    options?: NotificationOptions,
  ) => undefined | Notification;
};

export const useNotificationStore = create<NotificationStore>(() => ({
  isReady: false,
  notificationStatus: "default",
  triggerToast: () => {},
  triggerSound: () => undefined,
  triggerNotification: () => undefined,
}));
