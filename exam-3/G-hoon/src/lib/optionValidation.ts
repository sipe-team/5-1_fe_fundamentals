import type { MenuOption } from '@/types/order';

type OptionValidationRule = (
  option: MenuOption,
  selected: string[],
) => string | null;

const OPTION_VALIDATION_RULES: OptionValidationRule[] = [
  (option, selected) => {
    if (option.required && selected.length === 0) {
      return `${option.name}을(를) 선택해주세요`;
    }

    return null;
  },
  (option, selected) => {
    if (option.type !== 'list') return null;

    if (selected.length < option.minCount) {
      return `${option.name}을(를) 최소 ${option.minCount}개 이상 선택해주세요`;
    }

    if (selected.length > option.maxCount) {
      return `${option.name}은(는) 최대 ${option.maxCount}개까지 가능해요`;
    }

    return null;
  },
  (option, selected) => {
    if (
      (option.type === 'grid' || option.type === 'select') &&
      selected.length > 1
    ) {
      return `${option.name}은(는) 하나만 선택할 수 있어요`;
    }

    return null;
  },
];

export function validateOptionSelections(
  options: MenuOption[],
  selections: Map<number, string[]>,
): string | null {
  for (const opt of options) {
    const selected = selections.get(opt.id) ?? [];

    for (const rule of OPTION_VALIDATION_RULES) {
      const message = rule(opt, selected);
      if (message) return message;
    }
  }

  return null;
}
