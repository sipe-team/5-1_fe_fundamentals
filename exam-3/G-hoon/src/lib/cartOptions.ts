import type {
  CartOptionSelection,
  MenuOption,
  OptionSelection,
} from '@/types/order';

export function toCartOptionSelections(
  selections: OptionSelection[],
  options: MenuOption[],
): CartOptionSelection[] {
  const optionNameById = new Map(
    options.map((option) => [option.id, option.name]),
  );

  return selections.map((selection) => ({
    ...selection,
    name: optionNameById.get(selection.optionId),
  }));
}
