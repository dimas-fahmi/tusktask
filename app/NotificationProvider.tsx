"use client";

import type React from "react";
import { useEffect } from "react";
import { type ExternalToast, toast } from "sonner";
import { useGetSelfProfile } from "@/src/lib/queries/hooks/useGetSelfProfile";
import {
  type ToastType,
  useNotificationStore,
} from "@/src/lib/stores/notification";
import { usePreferencesStore } from "@/src/lib/stores/preferencesStore";

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

export const playAudio = (key: keyof typeof AUDIOS) => {
  const audioMetadata = AUDIOS[key];

  try {
    const audio = new Audio(audioMetadata.src);
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

  // Preload Sound
  useEffect(() => {
    new Audio(AUDIOS.alarm01.src);
    new Audio(AUDIOS.notification01.src);
  }, []);

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
    const triggerSound = (key: keyof typeof AUDIOS) => {
      if (!isSilent) {
        return playAudio(key);
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

      triggerSound("notification01");
    };

    useNotificationStore.setState({
      isReady: true,
      triggerSound,
      triggerToast,
      triggerNotification,
    });
  }, [isSilent]);

  return children;
};

export default NotificationProvider;
