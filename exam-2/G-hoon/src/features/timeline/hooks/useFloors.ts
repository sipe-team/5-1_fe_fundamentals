import { useQuery } from '@tanstack/react-query';
import { getRooms } from '@/shared/api';
import { queryKeys } from '@/shared/api/queryKeys';

export function useFloors() {
  return useQuery({
    queryKey: queryKeys.rooms,
    queryFn: getRooms,
    staleTime: Number.POSITIVE_INFINITY,
    select: (data) =>
      [...new Set(data.rooms.map((r) => r.floor))].sort((a, b) => a - b),
  });
}
