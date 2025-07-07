"use client";

import { useRouter, usePathname } from "next/navigation";
import { UseMutateFunction, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { NotificationType } from "@/src/db/schema/notifications";
import { TriggerToastProps } from "../../context/NotificationContext";
import { SetStateAction } from "@/src/types/types";
import useChatStore from "../../store/chatStore";
import {
  NotificationsPatchRequest,
  NotificationsPatchResponse,
} from "@/app/api/notifications/patch";
import { StandardResponse } from "../../utils/createResponse";
import { NotificationBundle } from "@/src/types/notification";

export const useInvalidateByNotificationType = (
  triggerToast: (options: TriggerToastProps) => void,
  setNotificationsDialogOpen: SetStateAction<boolean>,
  updateNotification: UseMutateFunction<
    NotificationsPatchResponse,
    Error,
    NotificationsPatchRequest,
    {
      oldNots: StandardResponse<NotificationBundle>;
    }
  >
) => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const selectedRoom = useChatStore((s) => s.selectedRoom);
  const setSelectedRoom = useChatStore((s) => s.setSelectedRoom);
  const setOpenIndex = useChatStore((s) => s.setOpenIndex);

  const invalidateByNotificationType = (notification: NotificationType) => {
    switch (notification.type) {
      case "newRoomChat":
        queryClient.invalidateQueries({
          queryKey: ["conversations"],
        });
        break;

      case "directMessage":
        const conversationId = notification?.payload?.conversationId;

        queryClient.invalidateQueries({
          queryKey: ["conversation", conversationId],
        });

        const shouldIgnoreToast =
          pathname === "/dashboard/messages" && selectedRoom === conversationId;

        if (shouldIgnoreToast) return;

        triggerToast({
          type: "default",
          title: `${notification?.payload?.sender?.name} sent you a message`,
          description: `${notification?.payload?.content}`,
          action: (
            <Button
              variant={"toaster"}
              onClick={() => {
                router.push("/dashboard/messages"); // ✅ navigate to chat
                setSelectedRoom(conversationId);
                setOpenIndex(false);
                updateNotification({
                  notificationId: notification.id,
                  newValue: {
                    status: "acknowledged",
                  },
                });
              }}
            >
              Open
            </Button>
          ),
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

  return { invalidateByNotificationType };
};
