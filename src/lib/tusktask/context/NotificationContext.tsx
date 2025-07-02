import { cva } from "class-variance-authority";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { ExternalToast, toast, Toaster } from "sonner";
import { cn } from "../../shadcn/utils";
import {
  AlarmClock,
  Bell,
  CircleAlert,
  CircleCheckBig,
  LucideIcon,
} from "lucide-react";
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
import AlertDialog from "@/src/ui/components/tusktask/prefabs/AlertDialog";
import { createNotification as createNotificationFn } from "../mutators/createtNotification";
import { NotificationsPostRequest } from "@/app/api/notifications/post";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { invalidateByNotificationType } from "../invalidators/notifications/invalidators";

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
  newNotification: boolean;

  // Create Notification
  createNotification: UseMutateFunction<
    NotificationsPatchResponse,
    Error,
    NotificationsPostRequest,
    unknown
  >;

  // Alert Dialog
  alertDialog: AlertDialogState;
  setAlertDialog: SetStateAction<AlertDialogState>;
  triggerAlertDialog: (props: Omit<AlertDialogState, "open">) => void;
  handleResetAlertDialog: () => void;
}

export type PlaySoundType =
  | "notification"
  | "positive"
  | "negative"
  | "ping"
  | "error"
  | "alarm"
  | "mute";

const NotificationContext = createContext<NotificationContextValues | null>(
  null
);

export type AlertDialogState = {
  open: boolean;
  title: string;
  description: string;
  icon?: LucideIcon;
  confirmText?: string;
  showCancelButton?: boolean;
  confirm?: () => void;
  cancel?: () => void;
};

const NotificationContextProvider = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  // Alert dialog
  const initialAlertDialog: AlertDialogState = {
    open: false,
    title: "",
    confirmText: "confirm",
    description: "",
    showCancelButton: false,
    cancel: () => {},
    confirm: () => {},
  };

  const [alertDialog, setAlertDialog] =
    useState<AlertDialogState>(initialAlertDialog);

  const handleResetAlertDialog = () => {
    setAlertDialog(initialAlertDialog);
  };

  const triggerAlertDialog = (props: Omit<AlertDialogState, "open">) => {
    setAlertDialog({
      open: true,
      ...props,
    });
  };

  // Notifications Dialog State
  const [notificationsDialogOpen, setNotificationsDialogOpen] = useState(false);

  // Sound Context State
  const [notificationSoundEnable, setNotificationSoundEnable] = useState(false);
  const [reminderSoundEnable, setReminderSoundEnable] = useState(true);
  const [activeSounds, setActiveSounds] = useState<HTMLAudioElement[]>([]);

  // Pull personal data
  const { personal } = usePersonalContext();

  // Notification Polling
  const { data: ntfBundle, isLoading: isLoadingNtfBundle } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    refetchInterval: 1000 * 5, // 10 seconds intervar
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
      setNotificationSoundEnable(personal.notificationSoundEnable ?? false);
      setReminderSoundEnable(personal.reminderSoundEnable ?? false);
    }
  }, [personal]);

  // PlaySound context
  const playSound = (type: PlaySoundType = "notification") => {
    stopAllSounds();

    if (type === "mute") return;

    const audioFiles: Record<Exclude<PlaySoundType, "mute">, string> = {
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

  const [notificationLength, setNotificationLength] = useState(0);
  const [invitationLength, setInvitationLength] = useState(0);
  const latestNotification = useRef<Date | null>(null);
  const [newNotification, setNewNotification] = useState(false);

  useEffect(() => {
    const nots = received.filter((t) => t.status === "not_read");

    if (nots.length !== notificationLength) {
      setNotificationLength(nots.length);
    }

    if (!isLoadingNtfBundle && nots.length > 0) {
      const latestFetched = nots.reduce((latest, n) => {
        return new Date(n.createdAt) > new Date(latest.createdAt) ? n : latest;
      });

      const lastSeen = latestNotification.current;

      if (!lastSeen || new Date(latestFetched.createdAt) > new Date(lastSeen)) {
        setNewNotification(true);
        invalidateByNotificationType(
          latestFetched.type,
          queryClient,
          latestFetched
        );
        triggerToast({
          type: "default",
          title: "New Notification",
          description: "You have a new notification",
          action: (
            <Button
              variant={"toaster"}
              onClick={() => setNotificationsDialogOpen(true)}
            >
              Open
            </Button>
          ),
        });
      }

      latestNotification.current = latestFetched.createdAt;
    }
  }, [received]);

  useEffect(() => {
    const length =
      sentInvitation.filter((t) => ["accepted", "rejected"].includes(t.status))
        .length +
      receivedInvitation.filter((t) => [
        "accepted",
        "rejected".includes(t.status),
      ]).length;

    if (length !== invitationLength) {
      setInvitationLength(length);
    }
  }, [sentInvitation, receivedInvitation]);

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["teams"],
    });

    queryClient.invalidateQueries({
      queryKey: ["team"],
      exact: false,
    });
  }, [invitationLength]);

  // Update Notification
  const { mutate: updateNotification } = useMutation({
    mutationKey: ["notifications", "mutate"],
    mutationFn: mutateNotificationData,
    onMutate: async (data) => {
      triggerToast({
        type: "default",
        title: "Saving Your Changes",
        description: "We're saving your changes in the background",
        sound: "mute",
      });

      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      const oldNots = queryClient.getQueryData([
        "notifications",
      ]) as StandardResponse<NotificationBundle>;

      if (oldNots?.data) {
        queryClient.setQueryData(["notifications"], () => {
          // ts squirk, asking for another validation
          if (!oldNots.data) return;
          const received = [...oldNots.data.received];
          const index = received.findIndex((t) => t.id === data.notificationId);

          if (index !== -1) {
            received[index] = {
              ...received[index],
              ...data.newValue,
            };
          }

          return {
            ...oldNots,
            data: {
              ...oldNots.data,
              received,
            },
          };
        });
      }

      return { oldNots };
    },
    onError: (error, _, context) => {
      triggerToast({
        type: "error",
        title: "Something Went Wrong",
        description: "Failed when saving your changes",
        sound: "mute",
      });

      if (context?.oldNots) {
        queryClient.setQueryData(["notifications"], context.oldNots);
      }
    },
    onSuccess: () => {
      triggerToast({
        type: "success",
        title: "Your Changes Are Saved",
        description:
          "Successfully saved your changes, everything is sync with cloud storage",
        sound: "mute",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  useEffect(() => {
    if (notificationsDialogOpen) {
      setNewNotification(false);
    }
  }, [notificationsDialogOpen]);

  // Create New Notification
  const { mutate: createNotification } = useMutation({
    mutationFn: createNotificationFn,
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
        newNotification,

        // Create Notification
        createNotification,

        // Alert Dialog
        alertDialog,
        setAlertDialog,
        triggerAlertDialog,
        handleResetAlertDialog,
      }}
    >
      {children}

      <NotificationsDialog />
      <AlertDialog />
      <Toaster />
    </NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationContextProvider };
