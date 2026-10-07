"use client";

import { useParams } from "next/navigation";

const ProjectDetailPageIndex = () => {
  const { id } = useParams<{ id: string }>();
  return <div>{id}</div>;
};

export default ProjectDetailPageIndex;
