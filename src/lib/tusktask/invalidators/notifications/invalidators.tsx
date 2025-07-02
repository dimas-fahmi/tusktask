"use client";

import { NotificationType } from "@/src/db/schema/notifications";
import { QueryClient } from "@tanstack/react-query";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { TriggerToastProps } from "../../context/NotificationContext";
import { SetStateAction } from "@/src/types/types";

export const invalidateByNotificationType = (
  queryClient: QueryClient,
  notification: NotificationType,
  triggerToast: (options: TriggerToastProps) => void,
  setNotificationsDialogOpen: SetStateAction<boolean>,
  pathname: string
) => {
  const invalidate = (type: NotificationType["type"]) => {
    switch (type) {
      case "newRoomChat":
        queryClient.invalidateQueries({
          queryKey: ["conversations"],
        });
        break;
      case "directMessage":
        queryClient.invalidateQueries({
          queryKey: ["conversation", notification?.payload?.conversationId],
        });

        if (pathname === "/dashboard/messages") return;

        triggerToast({
          type: "default",
          title: `${notification?.payload?.sender?.name} send you a message`,
          description: `${notification?.payload?.content}`,
        });

        break;
      default:
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
        break;
    }
  };

  invalidate(notification.type);
};
