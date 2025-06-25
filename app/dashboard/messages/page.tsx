import React from "react";
import { ChatPageIndex } from "./ChatPageIndex";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages | Dashboard",
};

const ChatPage = () => {
  return <ChatPageIndex />;
};

export default ChatPage;
