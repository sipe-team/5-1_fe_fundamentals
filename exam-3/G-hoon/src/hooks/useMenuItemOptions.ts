import { useSuspenseQuery } from '@tanstack/react-query';
import { getOptions } from '@/api/getOptions';
import { queryKeys } from '@/api/queryKeys';

export function useMenuItemOptions(optionIds: number[]) {
  return useSuspenseQuery({
    queryKey: queryKeys.catalog.options,
    queryFn: getOptions,
    select: (data) => {
      const optionIdSet = new Set(optionIds);
      return data.options.filter((option) => optionIdSet.has(option.id));
    },
  });
}
