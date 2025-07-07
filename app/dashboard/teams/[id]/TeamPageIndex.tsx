"use client";

import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import DesktopPage from "./DesktopPage";
import MobilePage from "./MobilePage";
import TeamChatDialog from "./fragments/TeamChatDialog";
import { useQuery } from "@tanstack/react-query";
import { fetchConversationDetails } from "@/src/lib/tusktask/fetchers/fetchConversationDetails";

const TeamPageIndex = ({ id }: { id: string }) => {
  // Team Chat open
  const [teamChatOpen, setTeamChatOpen] = useState(false);

  // Fetch Conversation
  const { data: conversationResponse } = useQuery({
    queryKey: ["conversation", id],
    queryFn: () => fetchConversationDetails(id),
    enabled: !!id,
  });

  // Responsive Mechanism
  const isDesktopOrLaptop = useMediaQuery({
    query: `(min-width:1080px)`,
  });

  return (
    <>
      {/* Main */}
      <div>
        {isDesktopOrLaptop ? (
          <DesktopPage id={id} setTeamChatOpen={setTeamChatOpen} />
        ) : (
          <MobilePage />
        )}
      </div>

      {/* Team Chat */}
      <TeamChatDialog open={teamChatOpen} setOpen={setTeamChatOpen} />
    </>
  );
};

export default TeamPageIndex;
