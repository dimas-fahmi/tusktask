import { useContext } from "react";
import { NotificationContext } from "../../context/NotificationContext";

const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "NotificationContext is out of reach, please make sure to use this within the NotificationContext provider"
    );
  }
  return context;
};

export default useNotificationContext;
