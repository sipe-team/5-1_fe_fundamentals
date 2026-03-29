import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getProducts } from '@/api';
import { useProductFilters } from './useProductFilters';

export function useProductCount() {
  const { categories, keyword } = useProductFilters();

  const { data, error, isPending } = useQuery({
    queryKey: ['productCount', { categories, keyword }],
    queryFn: () =>
      getProducts({
        categories,
        keyword: keyword || undefined,
        size: 1,
      }),
    select: (data) => data.total,
    placeholderData: keepPreviousData,
  });

  return {
    totalCount: data ?? null,
    hasError: Boolean(error) && data == null,
    isPending,
  };
}
