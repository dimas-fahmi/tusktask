import { cva } from "class-variance-authority";
import { createContext, useCallback, useEffect, useState } from "react";
import { ExternalToast, toast, Toaster } from "sonner";
import { cn } from "../../shadcn/utils";
import { AlarmClock, Bell, CircleAlert, CircleCheckBig } from "lucide-react";
import usePersonalContext from "../hooks/context/usePersonalContext";
import NotificationsDialog from "@/src/ui/components/tusktask/prefabs/NotificationsDialog";
import { SetStateAction } from "@/src/types/types";
import {
  UseMutateFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchNotifications } from "../fetchers/fetchNotifications";
import { FullNotification, NotificationBundle } from "@/src/types/notification";
import { joinTeam as jointTeamMutators } from "../mutators/joinTeam";
import {
  TeamMembersPostRequest,
  TeamMembersPostResponse,
} from "@/app/api/memberships/post";
import { StandardResponse } from "../utils/createResponse";
import { mutateNotificationData } from "../mutators/mutateNotificationData";
import {
  NotificationsPatchRequest,
  NotificationsPatchResponse,
} from "@/app/api/notifications/patch";

interface TriggerToastProps extends ExternalToast {
  title: string;
  type: "default" | "error" | "success" | "reminder";
  sound?: PlaySoundType;
}

interface NotificationContextValues {
  triggerToast: (options: TriggerToastProps) => void;
  triggerSound: (type: PlaySoundType) => void;
  notificationsDialogOpen: boolean;
  setNotificationsDialogOpen: SetStateAction<boolean>;
  received: FullNotification[];
  sent: FullNotification[];
  sentInvitation: FullNotification[];
  receivedInvitation: FullNotification[];
  joinTeam: UseMutateFunction<
    TeamMembersPostResponse,
    Error,
    TeamMembersPostRequest,
    unknown
  >;
  updateNotification: UseMutateFunction<
    NotificationsPatchResponse,
    Error,
    NotificationsPatchRequest,
    unknown
  >;
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
  // Notifications Dialog State
  const [notificationsDialogOpen, setNotificationsDialogOpen] = useState(false);

  // Sound Context State
  const [notificationSoundEnable, setNotificationSoundEnable] = useState(false);
  const [reminderSoundEnable, setReminderSoundEnable] = useState(true);
  const [activeSounds, setActiveSounds] = useState<HTMLAudioElement[]>([]);

  // Pull personal data
  const { personal } = usePersonalContext();

  // Notification Polling
  const { data: ntfBundle } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    refetchInterval: 100 * 10, // 10 seconds intervar
  });

  // Get received and sent notifications
  const received = ntfBundle?.data
    ? ntfBundle.data.received.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      })
    : [];
  const sent = ntfBundle?.data ? ntfBundle.data.sent : [];

  // Get received and sent team Invitation
  const sentInvitation = sent.filter((n) => n.type === "teamInvitation");
  const receivedInvitation = received.filter(
    (n) => n.type === "teamInvitation"
  );

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

    const sonnerVariants = cva(
      "!bg-background !text-foreground !cursor-pointer !shadow-xl select-none",
      {
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
      }
    );

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
        title: "!capitalize",
      },
      icon: <Icon />,
      ...options,
    });
  };

  // Query queryClient
  const queryClient = useQueryClient();

  // Join team
  const { mutate: joinTeam } = useMutation({
    mutationFn: jointTeamMutators,
    onMutate: async (data) => {
      const { authorizationId } = data;

      await queryClient.cancelQueries({
        queryKey: ["notifications"],
      });

      const oldNotifications = queryClient.getQueryData([
        "notifications",
      ]) as StandardResponse<NotificationBundle>;

      console.log(oldNotifications);
      if (oldNotifications?.data?.received) {
        const received = [...oldNotifications.data.received];
        const index = received.findIndex((t) => t.id === authorizationId);

        if (index !== -1) {
          received[index] = {
            ...received[index],
            status: "accepted",
          };

          const newData = {
            ...oldNotifications,
            data: {
              ...oldNotifications.data,
              received,
            },
          };

          queryClient.setQueryData(["notifications"], newData);
        }
      }

      return { oldNotifications };
    },

    onError: (error, __, context) => {
      console.log(error);
      if (context?.oldNotifications) {
        queryClient.setQueryData(["notifications"], context.oldNotifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      queryClient.invalidateQueries({
        queryKey: ["teams"],
      });

      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["teams"],
    });

    queryClient.invalidateQueries({
      queryKey: ["team"],
      exact: false,
    });
  }, [sentInvitation, receivedInvitation]);

  // Update Notification
  const { mutate: updateNotification } = useMutation({
    mutationKey: ["notifications", "mutate"],
    mutationFn: mutateNotificationData,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });

  return (
    <NotificationContext.Provider
      value={{
        triggerToast,
        triggerSound,
        notificationsDialogOpen,
        setNotificationsDialogOpen,
        joinTeam,
        received,
        sent,
        receivedInvitation,
        sentInvitation,
        updateNotification,
      }}
    >
      {children}

      <NotificationsDialog />
      <Toaster />
    </NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationContextProvider };
