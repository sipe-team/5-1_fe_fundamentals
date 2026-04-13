import { useSuspenseQuery } from '@tanstack/react-query';
import { getMenuDetail } from '@/features/menu/api/menu';
import type { MenuItem, MenuItemResponse } from '@/features/menu/types';
import { menuQueryKeys } from './queryKeys';

export function useMenuDetail(itemId: string) {
  return useSuspenseQuery<MenuItemResponse, Error, MenuItem>({
    queryKey: menuQueryKeys.detailById(itemId),
    queryFn: () => getMenuDetail(itemId),
    select: (response) => response.item,
  });
}
