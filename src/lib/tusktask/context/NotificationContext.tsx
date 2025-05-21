import { cva } from "class-variance-authority";
import { createContext, useCallback, useEffect, useState } from "react";
import { ExternalToast, toast, Toaster } from "sonner";
import { cn } from "../../shadcn/utils";
import { AlarmClock, Bell, CircleAlert, CircleCheckBig } from "lucide-react";
import usePersonalContext from "../hooks/context/usePersonalContext";

interface TriggerToastProps extends ExternalToast {
  title: string;
  type: "default" | "error" | "success" | "reminder";
  sound?: PlaySoundType;
}

interface NotificationContextValues {
  triggerToast: (options: TriggerToastProps) => void;
  triggerSound: (type: PlaySoundType) => void;
}

export type PlaySoundType =
  | "notification"
  | "positive"
  | "negative"
  | "ping"
  | "error"
  | "alarm";

const NotificationContext = createContext<NotificationContextValues | null>(
  null
);

const NotificationContextProvider = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  // Sound Context State
  const [notificationSoundEnable, setNotificationSoundEnable] = useState(false);
  const [reminderSoundEnable, setReminderSoundEnable] = useState(true);
  const [activeSounds, setActiveSounds] = useState<HTMLAudioElement[]>([]);

  // Pull personal data
  const { personal } = usePersonalContext();

  // Synchronize personal prefences with context
  useEffect(() => {
    if (personal) {
      setNotificationSoundEnable(personal.notificationSoundEnable!);
      setReminderSoundEnable(personal.reminderSoundEnable!);
    }
  }, [personal]);

  // PlaySound context
  const playSound = (type: PlaySoundType = "notification") => {
    stopAllSounds();

    const audioFiles: Record<PlaySoundType, string> = {
      error: "error.wav",
      negative: "negative.wav",
      notification: "notification.wav",
      ping: "ping.wav",
      positive: "positive.wav",
      alarm: "alarm.wav",
    };

    const audio = new Audio(`/sounds/${audioFiles[type]}`);
    audio.play().catch((err) => {
      console.warn("Failed to play sound:", err);
    });

    setActiveSounds((prev) => [...prev, audio]);

    // Remove it from the list once it ends
    audio.addEventListener("ended", () => {
      setActiveSounds((prev) => prev.filter((a) => a !== audio));
    });
  };

  const stopAllSounds = () => {
    activeSounds.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    setActiveSounds([]);
  };

  // Trigger Sound Function
  const triggerSound = useCallback((type: PlaySoundType) => {
    if (notificationSoundEnable || (type === "alarm" && reminderSoundEnable)) {
      playSound(type);
    }
  }, []);

  // Trigger Toast Function
  const triggerToast = (options: TriggerToastProps) => {
    const { title, description, type, className, sound } = options;

    triggerSound(sound ?? "notification");

    const sonnerVariants = cva("!cursor-pointer !shadow-xl select-none", {
      variants: {
        variant: {
          default: "",
          error: "!bg-destructive !text-destructive-foreground ",
          success: "",
          reminder: "",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    });

    const icons = {
      default: Bell,
      error: CircleAlert,
      success: CircleCheckBig,
      reminder: AlarmClock,
    };

    const Icon = icons[type];

    toast(title, {
      description: description,
      descriptionClassName: options.descriptionClassName,
      duration: options.duration,
      classNames: {
        toast: `${cn(sonnerVariants({ variant: type, className }))}`,
        description: `${cn(sonnerVariants({ variant: type, className }))} !border-0`,
        content: "ms-2",
      },
      icon: <Icon />,
      ...options,
    });
  };

  return (
    <NotificationContext.Provider value={{ triggerToast, triggerSound }}>
      {children}
      <Toaster />
    </NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationContextProvider };
