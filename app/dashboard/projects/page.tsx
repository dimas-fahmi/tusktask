import type { Metadata } from "next";
import ProjectsPageIndex from "./ProjectsPageIndex";

export const metadata: Metadata = {
  title: "Projects | TuskTask",
};

const ProjectsPage = () => {
  return <ProjectsPageIndex />;
};

export default ProjectsPage;
