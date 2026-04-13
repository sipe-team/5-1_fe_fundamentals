import type { MenuOption, OptionSelection } from '@/features/menu/types';

export function getOptionExtraPrice(option: MenuOption, selectedLabels: string[]): number {
  let sum = 0;
  for (const label of selectedLabels) {
    const idx = option.labels.indexOf(label);
    if (idx !== -1) {
      sum += option.prices[idx];
    }
  }
  return sum;
}

export function getUnitPrice(
  basePrice: number,
  availableOptions: MenuOption[],
  selections: OptionSelection[],
): number {
  const selectionByOptionId = new Map(selections.map((s) => [s.optionId, s]));
  let extras = 0;
  for (const option of availableOptions) {
    const sel = selectionByOptionId.get(option.id);
    if (!sel) continue;
    extras += getOptionExtraPrice(option, sel.labels);
  }
  return basePrice + extras;
}

export function getTotalPrice(unitPrice: number, quantity: number): number {
  return unitPrice * quantity;
}
