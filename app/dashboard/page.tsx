import type { Metadata } from "next";
import DashboardPageIndex from "./DashboardPageIndex";

export const metadata: Metadata = {
  title: "Dashboard | TuskTask",
};

const DashboardPage = () => {
  return <DashboardPageIndex />;
};

export default DashboardPage;
