import { useSuspenseQuery } from '@tanstack/react-query';
import { getCategories } from '@/features/menu/api/menu';
import type { CategoriesResponse, MenuCategory } from '@/features/menu/types';
import { menuQueryKeys } from './queryKeys';

export function useCategories() {
  return useSuspenseQuery<CategoriesResponse, Error, MenuCategory[]>({
    queryKey: menuQueryKeys.categories(),
    queryFn: getCategories,
    select: (response) => response.categories,
    staleTime: Infinity,
  });
}
