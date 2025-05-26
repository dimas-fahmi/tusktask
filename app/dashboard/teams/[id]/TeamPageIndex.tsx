"use client";

import React from "react";
import { useMediaQuery } from "react-responsive";
import DesktopPage from "./DesktopPage";
import MobilePage from "./MobilePage";

const TeamPageIndex = ({ id }: { id: string }) => {
  const isDesktopOrLaptop = useMediaQuery({
    query: `(min-width:1224px)`,
  });

  return isDesktopOrLaptop ? <DesktopPage id={id} /> : <MobilePage />;
};

export default TeamPageIndex;
