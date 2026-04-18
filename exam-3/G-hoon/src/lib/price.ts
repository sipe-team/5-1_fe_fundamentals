import type { MenuOption, OptionSelection } from '@/types/order';

export function calculateUnitPrice(
  basePrice: number,
  selections: OptionSelection[],
  options: MenuOption[],
): number {
  let total = basePrice;
  for (const selection of selections) {
    const option = options.find((o) => o.id === selection.optionId);
    if (!option) continue;
    for (const label of selection.labels) {
      const idx = option.labels.indexOf(label);
      if (idx !== -1) total += option.prices[idx] ?? 0;
    }
  }
  return total;
}
