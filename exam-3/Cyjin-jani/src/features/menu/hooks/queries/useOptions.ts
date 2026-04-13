import { useSuspenseQuery } from '@tanstack/react-query';
import { getOptions } from '@/features/menu/api/menu';
import type { MenuOption, OptionsResponse } from '@/features/menu/types';
import { menuQueryKeys } from './queryKeys';

// NOTE: 주문 플로우에서 목록이 비교적 안정적이라고 보는 구간(분 단위)에 맞춘 시간 (5분)
const OPTIONS_LIST_STALE_MS = 5 * 60 * 1000;

// NOTE: 주문 페이지(MenuDetail)을 제외한 경우에 캐싱을 이용하기 위함
export type UseOptionsConfig = {
  refetchOnMount?: boolean | 'always';
};

export function useOptions(config?: UseOptionsConfig) {
  return useSuspenseQuery<OptionsResponse, Error, MenuOption[]>({
    queryKey: menuQueryKeys.options(),
    queryFn: getOptions,
    select: (response) => response.options,
    staleTime: OPTIONS_LIST_STALE_MS,
    refetchOnMount: config?.refetchOnMount,
  });
}
