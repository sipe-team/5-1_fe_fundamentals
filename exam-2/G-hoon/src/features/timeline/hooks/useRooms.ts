import { useSuspenseQuery } from '@tanstack/react-query';
import { getRooms } from '@/shared/api';
import { queryKeys } from '@/shared/api/queryKeys';

export function useRooms() {
  return useSuspenseQuery({
    queryKey: queryKeys.rooms,
    queryFn: getRooms,
    staleTime: Infinity,
    select: (data) => data.rooms,
  });
}
