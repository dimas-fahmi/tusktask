import { useContext } from "react";
import { TeamContext } from "../../context/TeamContext";

const useTeamContext = () => {
  const context = useContext(TeamContext);

  if (!context) {
    throw new Error("TeamContext is out of reach");
  }

  return context;
};

export default useTeamContext;
