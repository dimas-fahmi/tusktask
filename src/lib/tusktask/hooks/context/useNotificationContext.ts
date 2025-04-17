import { NotificationContext } from "@/src/context/NotificationContext";
import { useContext } from "react";

const useNotificationContext = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("Sound context is out of range");
  }

  return context;
};

export default useNotificationContext;
