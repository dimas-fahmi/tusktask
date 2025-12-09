"use client";

import type React from "react";
import { useEffect } from "react";
import { type ExternalToast, toast } from "sonner";
import { useGetSelfProfile } from "@/src/lib/queries/hooks/useGetSelfProfile";
import {
  AUDIOS,
  type ToastType,
  useNotificationStore,
} from "@/src/lib/stores/notification";
import { usePreferencesStore } from "@/src/lib/stores/preferencesStore";

export const playAudio = (audio: HTMLAudioElement) => {
  try {
    audio.play();

    return audio;
  } catch (error) {
    console.error(`Failed when playing [key]:`, error);
  }
};

const NotificationProvider = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  const { data: profile, isPending: isLoadingProfile } = useGetSelfProfile();
  const { isSilent, setIsSilent } = usePreferencesStore();
  const {
    alarmAudio,
    notificationAudio,
    setAlarmAudio,
    setNotificationAudio,
    activeAlarmAudio,
    activeNotificationAudio,
  } = useNotificationStore();

  // Load Audio
  useEffect(() => {
    setAlarmAudio(new Audio(AUDIOS[activeAlarmAudio].src));
    setNotificationAudio(new Audio(AUDIOS[activeNotificationAudio].src));
  }, [
    activeAlarmAudio,
    activeNotificationAudio,
    setAlarmAudio,
    setNotificationAudio,
  ]);

  // Initialize Permission When Loaded
  useEffect(() => {
    const status = Notification.permission;

    if (status === "default") {
      Notification.requestPermission().then((value) => {
        useNotificationStore.setState({
          notificationStatus: value,
        });
      });

      return;
    }

    useNotificationStore.setState({
      notificationStatus: status,
    });
  }, []);

  // Sync Preferences
  useEffect(() => {
    const user = profile?.result;
    if (!user || isLoadingProfile) return;

    if (typeof user?.isSilent === "boolean" && isSilent !== user?.isSilent) {
      setIsSilent(user?.isSilent);
    }
  }, [profile, isLoadingProfile, isSilent, setIsSilent]);

  useEffect(() => {
    useNotificationStore.setState({
      isReady: false,
    });

    // TriggerSound
    const triggerSound = (type: "alarm" | "notification") => {
      if (!alarmAudio || !notificationAudio) return;
      if (!isSilent) {
        return playAudio(type === "alarm" ? alarmAudio : notificationAudio);
      }
    };

    // TriggerNotification
    const triggerNotification = (
      title: string,
      options?: NotificationOptions,
    ) => {
      const notification = new Notification(title, options);
      return notification;
    };

    // TriggerToast
    const triggerToast = (
      message: string,
      options?: ExternalToast,
      type?: ToastType,
    ) => {
      if (!type) {
        toast(message, {
          ...options,
        });
      } else {
        toast[type](message, {
          ...options,
        });
      }

      triggerSound("notification");
    };

    useNotificationStore.setState({
      isReady: true,
      triggerSound,
      triggerToast,
      triggerNotification,
    });
  }, [isSilent, alarmAudio, notificationAudio]);

  return children;
};

export default NotificationProvider;
