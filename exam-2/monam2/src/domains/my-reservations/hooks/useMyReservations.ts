import { useSuspenseQuery } from "@tanstack/react-query";

import { getMyReservations } from "@/domains/my-reservations/apis";

const QUERY_KEY = ["my-reservations"];

export default function useMyReservations() {
  return useSuspenseQuery({
    queryKey: QUERY_KEY,
    queryFn: getMyReservations,
    select: (data) => data.reservations,
  });
}

useMyReservations.getQueryKeys = () => {
  return QUERY_KEY;
};
