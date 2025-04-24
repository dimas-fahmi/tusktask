"use client";

import { createContext, useCallback, useEffect, useState } from "react";

import {
  TriggerToastProps,
  triggerToast as rawTriggerToast,
} from "@/src/lib/tusktask/utils/triggerToast";
import { useSession } from "next-auth/react";

export type NotificationPermissionType = "granted" | "denied" | "default";

export interface NotificationContextValues {
  notificationSound: boolean;
  setNotificationSound: React.Dispatch<React.SetStateAction<boolean>>;
  reminderSound: boolean;
  setReminderSound: React.Dispatch<React.SetStateAction<boolean>>;
  isRegulated: boolean;
  setIsRegulated: React.Dispatch<React.SetStateAction<boolean>>;
  triggerToast: (props: TriggerToastProps) => void;
  permissionStatus: NotificationPermissionType;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  triggerSound: (type: PlaySoundType) => void;
}

export type PlaySoundType =
  | "notification"
  | "positive"
  | "negative"
  | "ping"
  | "error";

export const playSound = (type: PlaySoundType = "notification") => {
  const audioFiles: Record<PlaySoundType, string> = {
    error: "error.wav",
    negative: "negative.wav",
    notification: "notification.wav",
    ping: "ping.wav",
    positive: "positive.wav",
  };

  const audio = new Audio(`/sounds/${audioFiles[type]}`);
  audio.play().catch((err) => {
    console.warn("Failed to play sound:", err);
  });
};

export const NotificationContext =
  createContext<NotificationContextValues | null>(null);

export const NotificationContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notificationSound, setNotificationSound] = useState(true);
  const [reminderSound, setReminderSound] = useState(true);
  const [isRegulated, setIsRegulated] = useState(true);
  const { data: session } = useSession();
  const [permissionStatus, setPermissionStatus] =
    useState<NotificationContextValues["permissionStatus"]>("default");
  const [index, setIndex] = useState(1);

  useEffect(() => {
    setPermissionStatus(Notification.permission);
  }, [index]);

  useEffect(() => {
    setIsRegulated(true);

    const debounce = setTimeout(() => {
      setIsRegulated(false);
    }, 1000);

    return () => clearTimeout(debounce);
  }, [notificationSound, reminderSound, setIsRegulated]);

  const triggerToast = (props: TriggerToastProps) => {
    const { type } = props;

    const shouldPlay =
      (type === "reminder" && reminderSound) ||
      (type !== "reminder" && notificationSound);

    if (shouldPlay) {
      playSound();
    }

    rawTriggerToast(props);
  };

  useEffect(() => {
    if (!session || !session.user) return;

    setNotificationSound(session.user.notificationSound);
    setReminderSound(session.user.reminderSound);
  }, [session]);

  const triggerSound = useCallback((type: PlaySoundType) => {
    if (notificationSound) {
      playSound(type);
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notificationSound,
        setNotificationSound,
        reminderSound,
        setReminderSound,
        isRegulated,
        setIsRegulated,
        triggerToast,
        permissionStatus,
        setIndex,
        triggerSound,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
