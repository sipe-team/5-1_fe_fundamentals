import { useSuspenseQuery } from '@tanstack/react-query';

import { getItems } from '@/domains/menu/apis';
import type { MenuResponse } from '@/shared/types';

const QUERY_KEY = ['menu', 'items'] as const;
const selectMenus = ({ items }: MenuResponse) => items;

export default function useMenus() {
  return useSuspenseQuery({
    queryKey: useMenus.getQueryKeys(),
    queryFn: getItems,
    select: selectMenus,
  });
}

useMenus.getQueryKeys = () => QUERY_KEY;
