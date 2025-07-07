"use client";

import { QueryClient } from "@tanstack/react-query";
import { DetailConversationGetResponse } from "@/app/api/conversations/[id]/details/get";
import { useSession } from "next-auth/react";

export const registerNewMessageToConversation = (
  queryClient: QueryClient,
  userId: string,
  content?: string,
  selectedRoom?: string
) => {
  queryClient.cancelQueries({
    queryKey: ["conversation", selectedRoom],
  });

  if (!selectedRoom || !content) return;

  const oldData = queryClient.getQueryData([
    "conversation",
    selectedRoom,
  ]) as DetailConversationGetResponse;

  queryClient.setQueryData(["conversation", selectedRoom], () => {
    if (!oldData?.data) return oldData;

    let messages = [...oldData?.data?.messages];

    messages.push({
      content: content ?? "N/A",
      conversationId: selectedRoom,
      createdAt: new Date(),
      id: crypto.randomUUID(),
      senderId: userId,
      respondToId: null,
      createdByOptimisticUpdate: true,
    });

    return {
      ...oldData,
      data: {
        ...oldData?.data,
        messages,
      },
    };
  });
};
