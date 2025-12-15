import type { Metadata } from "next";
import EmptyProjectsIndex from "./EmptyProjectsIndex";

export const metadata: Metadata = {
  title: "No Projects Found | TuskTask",
};

const EmptyProjectsPage = () => {
  return <EmptyProjectsIndex />;
};

export default EmptyProjectsPage;
