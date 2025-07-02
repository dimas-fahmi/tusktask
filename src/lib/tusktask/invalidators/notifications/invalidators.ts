"use client";

import { NotificationType } from "@/src/db/schema/notifications";
import { QueryClient } from "@tanstack/react-query";

export const invalidateByNotificationType = (
  latestType: NotificationType["type"],
  queryClient: QueryClient
) => {
  const invalidate = (type: NotificationType["type"]) => {
    switch (type) {
      case "newRoomChat":
        queryClient.invalidateQueries({
          queryKey: ["conversations"],
        });
        break;
    }
  };

  invalidate(latestType);
};
