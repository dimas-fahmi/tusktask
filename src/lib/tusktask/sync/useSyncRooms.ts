import { useQuery } from "@tanstack/react-query";
import { fetchConversations } from "../fetchers/fetchConversations";
import useChatStore from "../store/chatStore";
import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";

const useSyncRooms = () => {
  // Pull setters
  const { setRooms, setRoomsQueryResult } = useChatStore(
    useShallow((s) => ({
      setRooms: s.setRooms,
      setRoomsQueryResult: s.setRoomsQueryResult,
    }))
  );

  //   Query
  const query = useQuery({
    queryKey: ["conversations"],
    queryFn: () => fetchConversations(),
  });

  //   Listen to query changes
  useEffect(() => {
    setRoomsQueryResult(query);

    if (query?.data?.data) {
      setRooms(query.data.data);
    }
  }, [query, setRooms, setRoomsQueryResult]);
};

export default useSyncRooms;
