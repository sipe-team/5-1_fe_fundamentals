import { useSuspenseQuery } from '@tanstack/react-query';
import { getCategories } from '@/api/getCategories';
import { queryKeys } from '@/api/queryKeys';

export function useCategories() {
  return useSuspenseQuery({
    queryKey: queryKeys.catalog.categories,
    queryFn: getCategories,
    select: (data) => data.categories,
  });
}
