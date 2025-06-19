import { SubtaskType } from "@/src/types/task";
import React from "react";

export interface SubtaskCardProps {
  task: SubtaskType;
}

const SubtaskCard: React.FC<SubtaskCardProps> = ({ task }) => {
  return <div></div>;
};

export default SubtaskCard;
