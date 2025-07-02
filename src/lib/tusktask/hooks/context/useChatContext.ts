import React, { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("Chat Context is out of reach!");
  }
  return context;
};

export default useChatContext;
