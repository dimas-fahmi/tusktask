import React from "react";
import { Metadata } from "next";
import LandingPageindex from "@/src/ui/pages/Home/LandingPage";

export const metadata: Metadata = {
  title: "We'll Remember it for you | TuskTask",
  description: "TuskTask - Task Management App",
};

const LandingPage = () => {
  return (
    <>
      <LandingPageindex />
    </>
  );
};

export default LandingPage;
