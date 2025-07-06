import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { fetchConversationDetails } from "../fetchers/fetchConversationDetails";
import useChatStore from "../store/chatStore";
import { useShallow } from "zustand/react/shallow";

const useSyncConversation = () => {
  // Pull values from chat store
  const {
    selectedRoom,
    setConversationDetails,
    setConversationDetailsQueryResult,
    setMessages,
  } = useChatStore(
    useShallow((s) => ({
      selectedRoom: s.selectedRoom,
      setConversationDetails: s.setConversationDetails,
      setConversationDetailsQueryResult: s.setConversationDetailsQueryResult,
      setMessages: s.setMessages,
    }))
  );

  // Define query
  const query = useQuery({
    queryKey: ["conversation", selectedRoom],
    queryFn: () => fetchConversationDetails(selectedRoom),
    enabled: !!selectedRoom,
  });

  // Listen to query and sync data
  useEffect(() => {
    setConversationDetailsQueryResult(query);

    if (query?.data?.data) {
      const conversationDetails = query.data.data;
      setConversationDetails(conversationDetails);
      if (conversationDetails?.messages) {
        setMessages(conversationDetails.messages);
      }
    }
  }, [
    query,
    setConversationDetails,
    setConversationDetailsQueryResult,
    setMessages,
  ]);
};

export default useSyncConversation;
