import { TasksContext } from "@/src/context/TasksContext";
import { useContext } from "react";

const useTasksContext = () => {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error(
      "Tasks Context is out of range, must be within TasksContextProvider"
    );
  }

  return context;
};

export default useTasksContext;
