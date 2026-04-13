import { useSuspenseQuery } from '@tanstack/react-query';
import { getOptions } from '@/api/getOptions';
import { queryKeys } from '@/api/queryKeys';

export function useOptions() {
  return useSuspenseQuery({
    queryKey: queryKeys.catalog.options,
    queryFn: getOptions,
    select: (data) => data.options,
  });
}
