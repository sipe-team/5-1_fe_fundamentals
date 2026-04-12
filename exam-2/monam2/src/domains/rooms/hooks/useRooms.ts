import { useSuspenseQuery } from '@tanstack/react-query';

import { getRooms } from '@/domains/rooms/apis';

const QUERY_KEY = ['rooms'] as const;

export default function useRooms() {
  return useSuspenseQuery({
    queryKey: useRooms.getQueryKeys(),
    queryFn: getRooms,
    select: (data) => data.rooms,
  });
}

useRooms.getQueryKeys = () => {
  return QUERY_KEY;
};
