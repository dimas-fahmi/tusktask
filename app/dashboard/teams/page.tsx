import React from "react";
import TeamsPageIndex from "./TeamsPageIndex";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teams | TuskTask",
};

const TeamsPage = () => {
  return <TeamsPageIndex />;
};

export default TeamsPage;
