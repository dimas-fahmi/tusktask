import React from "react";
import ProjectsPageIndex from "./ProjectsPageIndex";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Dashboard",
};

const ProjectsPage = () => {
  return (
    <div>
      <ProjectsPageIndex />
    </div>
  );
};

export default ProjectsPage;
