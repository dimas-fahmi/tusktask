import { Metadata } from "next";
import React from "react";
import DashboardPageIndex from "./DashboardPageIndex";

export const metadata: Metadata = {
  title: "Dashboard | TuskTask",
};

const DashboardPage = () => {
  return <DashboardPageIndex />;
};

export default DashboardPage;
