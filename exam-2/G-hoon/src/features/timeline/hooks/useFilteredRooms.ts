import { useSuspenseQuery } from '@tanstack/react-query';
import { getRooms } from '@/shared/api';
import { queryKeys } from '@/shared/api/queryKeys';
import type { Room } from '@/types/reservation';

export function useFilteredRooms(filterFn: (room: Room) => boolean) {
  return useSuspenseQuery({
    queryKey: queryKeys.rooms,
    queryFn: getRooms,
    staleTime: Infinity,
    select: (data) => data.rooms.filter(filterFn),
  });
}
