import React, { useContext } from "react";
import { TaskContext } from "../../context/TaskContext";

const useTaskContext = () => {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error("TaskContext is out of reach");
  }

  return context;
};

export default useTaskContext;
