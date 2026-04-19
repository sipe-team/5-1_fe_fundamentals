import { MAX_QUANTITY } from '@/domains/cart/utils';
import type { MenuItem, MenuOption } from '@/shared/types';
import { calculateOptionPrice } from '.';

export type GridSelections = Record<number, string | undefined>;
export type SelectSelections = Record<number, string | undefined>;
export type ListSelections = Record<number, string[] | undefined>;
export interface OrderFormSelections {
  gridSelections: GridSelections;
  selectSelections: SelectSelections;
  listSelections: ListSelections;
}

/**
 * 선택된 라벨을 가져옵니다.
 * @param option 옵션
 * @param gridSelections 그리드 선택
 * @param selectSelections 셀렉트 선택
 * @param listSelections 리스트 선택
 * @returns 선택된 라벨
 */
export function getSelectedLabels(
  option: MenuOption,
  selections: OrderFormSelections,
) {
  if (option.type === 'grid') {
    return selections.gridSelections[option.id]
      ? [selections.gridSelections[option.id]!]
      : [];
  }

  if (option.type === 'select') {
    return selections.selectSelections[option.id]
      ? [selections.selectSelections[option.id]!]
      : [];
  }

  return selections.listSelections[option.id] ?? [];
}

/**
 * 한글의 마지막 글자가 받침이 있는지 확인합니다.
 * @param value 확인할 문자열
 * @returns 받침이 있으면 true, 없으면 false
 */
export function hasBatchim(value: string) {
  const lastChar = value[value.length - 1];

  if (!lastChar) {
    return false;
  }

  const code = lastChar.charCodeAt(0) - 0xac00;

  if (code < 0 || code > 11171) {
    return false;
  }

  return code % 28 !== 0;
}

/**
 * 선택 옵션이 필수일 때, 선택하지 않았을 때 표시할 메시지를 생성합니다.
 * @param value 옵션 이름
 * @returns 선택 메시지
 */
export function getSelectRequiredMessage(value: string) {
  return `${value}${hasBatchim(value) ? '을' : '를'} 선택해주세요`;
}

export function getSelectedOptions(
  visibleOptions: MenuOption[],
  selections: OrderFormSelections,
) {
  return visibleOptions.flatMap((option) => {
    const labels = getSelectedLabels(option, selections);

    if (labels.length === 0) {
      return [];
    }

    return [
      {
        optionId: option.id,
        labels,
      },
    ];
  });
}

export function getOrderValidationMessage(
  visibleOptions: MenuOption[],
  selections: OrderFormSelections,
) {
  for (const option of visibleOptions) {
    const labels = getSelectedLabels(option, selections);

    if (option.type === 'list' && labels.length < option.minCount) {
      return option.minCount === 1
        ? getSelectRequiredMessage(option.name)
        : `${option.name}${hasBatchim(option.name) ? '을' : '를'} 최소 ${option.minCount}개 선택해주세요`;
    }

    if (option.required && labels.length === 0) {
      return getSelectRequiredMessage(option.name);
    }
  }

  return null;
}

/**
 * 메뉴의 단일 가격을 계산합니다.
 * @param menuItem 메뉴
 * @param visibleOptions
 * @param gridSelections
 * @param selectSelections
 * @param listSelections
 * @returns
 */
export function calculateUnitPrice(
  menuItem: MenuItem,
  visibleOptions: MenuOption[],
  selections: OrderFormSelections,
) {
  const optionPrice = visibleOptions.reduce((total, option) => {
    return (
      total +
      calculateOptionPrice(option, getSelectedLabels(option, selections))
    );
  }, 0);

  return menuItem.price + optionPrice;
}

export function clampQuantity(nextQuantity: number) {
  return Math.min(MAX_QUANTITY, Math.max(1, nextQuantity));
}
