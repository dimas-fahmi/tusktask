"use client";

import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import DesktopPage from "./DesktopPage";
import MobilePage from "./MobilePage";
import TeamChatDialog from "./fragments/TeamChatDialog";

const TeamPageIndex = ({ id }: { id: string }) => {
  // Team Chat open
  const [teamChatOpen, setTeamChatOpen] = useState(false);

  // Responsive Mechanism
  const isDesktopOrLaptop = useMediaQuery({
    query: `(min-width:1224px)`,
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
