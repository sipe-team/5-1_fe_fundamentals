import { useSuspenseQuery } from "@tanstack/react-query";
import { getRooms } from "@/domains/timeline/apis";

const QUERY_KEY = ["rooms"];

export default function useRooms() {
  return useSuspenseQuery({
    queryKey: QUERY_KEY,
    queryFn: getRooms,
    select: (data) => data.rooms,
  });
}

useRooms.getQueryKeys = () => {
  return QUERY_KEY;
};
