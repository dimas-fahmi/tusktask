import type { ExternalToast } from "sonner";
import { create } from "zustand";

export const AUDIOS = {
  notification01: {
    title: "Notification 01",
    src: "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/sounds/notification.wav",
    type: "notification",
  },
  alarm01: {
    title: "Alarm 01",
    src: "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/sounds/alarm-01.wav",
    type: "alarm",
  },
} as const;

export type ToastType = "success" | "info" | "warning" | "error";

export type NotificationStore = {
  isReady: boolean;
  notificationStatus: NotificationPermission;
  triggerToast: (
    message: string,
    options?: ExternalToast,
    type?: ToastType,
  ) => void;
  triggerSound: (
    type: "alarm" | "notification",
  ) => undefined | HTMLAudioElement;
  triggerNotification: (
    title: string,
    options?: NotificationOptions,
  ) => undefined | Notification;
  alarmAudio?: HTMLAudioElement;
  setAlarmAudio: (nv: HTMLAudioElement) => void;
  notificationAudio?: HTMLAudioElement;
  setNotificationAudio: (nv: HTMLAudioElement) => void;

  activeAlarmAudio: keyof typeof AUDIOS;
  setActiveAlarmAudio: (nv: keyof typeof AUDIOS) => void;

  activeNotificationAudio: keyof typeof AUDIOS;
  setActiveNotificationAudio: (nv: keyof typeof AUDIOS) => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  isReady: false,
  notificationStatus: "default",
  triggerToast: () => {},
  triggerSound: () => undefined,
  triggerNotification: () => undefined,

  alarmAudio: undefined,
  setAlarmAudio: (nv) => set({ alarmAudio: nv }),

  notificationAudio: undefined,
  setNotificationAudio: (nv) => set({ notificationAudio: nv }),

  activeAlarmAudio: "alarm01",
  setActiveAlarmAudio: (nv) => set({ activeAlarmAudio: nv }),

  activeNotificationAudio: "notification01",
  setActiveNotificationAudio: (nv) => set({ activeNotificationAudio: nv }),
}));
