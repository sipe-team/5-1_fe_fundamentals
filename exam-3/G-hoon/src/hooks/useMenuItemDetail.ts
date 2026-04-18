import { useSuspenseQuery } from '@tanstack/react-query';
import { getMenuItem } from '@/api/getMenuItem';
import { queryKeys } from '@/api/queryKeys';

export function useMenuItemDetail(itemId: string) {
  return useSuspenseQuery({
    queryKey: queryKeys.catalog.item(itemId),
    queryFn: () => getMenuItem(itemId),
    select: (data) => data.item,
  });
}
