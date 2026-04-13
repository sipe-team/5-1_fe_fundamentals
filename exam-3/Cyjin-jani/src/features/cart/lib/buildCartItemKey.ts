import type { OptionSelection } from '@/features/menu/types';

function compareOptionId(a: OptionSelection, b: OptionSelection): number {
  return a.optionId - b.optionId;
}

function compareLabelKo(a: string, b: string): number {
  return a.localeCompare(b, 'ko');
}

// NOTE: cartItemKey 형식 => `${itemId}__` + (옵션 없으면 빈 문자열, 있으면 정규화 배열의 JSON)
export function buildCartItemKey(
  itemId: string,
  options: OptionSelection[],
): string {
  const normalized = [...options]
    .sort(compareOptionId)
    .map(({ optionId, labels }) => ({
      optionId,
      labels: [...labels].sort(compareLabelKo),
    }));

  const suffix = normalized.length === 0 ? '' : JSON.stringify(normalized);

  return `${itemId}__${suffix}`;
}
