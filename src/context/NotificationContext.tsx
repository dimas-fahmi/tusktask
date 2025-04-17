"use client";

import { createContext, useEffect, useState } from "react";

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
}

export const playSound = () => {
  const audio = new Audio("/sounds/notification.wav");
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
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
