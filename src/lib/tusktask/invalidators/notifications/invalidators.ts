"use client";

import { NotificationType } from "@/src/db/schema/notifications";
import { QueryClient } from "@tanstack/react-query";

export const invalidateByNotificationType = (
  latestType: NotificationType["type"],
  queryClient: QueryClient,
  notification: NotificationType
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
    }
  };

  invalidate(latestType);
};
