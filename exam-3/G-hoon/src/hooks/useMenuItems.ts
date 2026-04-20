import { useSuspenseQuery } from '@tanstack/react-query';
import { getMenuItems } from '@/api/getMenuItems';
import { queryKeys } from '@/api/queryKeys';

export function useMenuItems() {
  return useSuspenseQuery({
    queryKey: queryKeys.catalog.items,
    queryFn: getMenuItems,
    select: (data) => data.items,
  });
}
