import { Metadata } from "next";
import React from "react";
import DashboardIndex from "./DashboardIndex";

export const metadata: Metadata = {
  title: "Dashboard | TuskTask",
};

const DashboardPage = () => {
  return <DashboardIndex />;
};

export default DashboardPage;
