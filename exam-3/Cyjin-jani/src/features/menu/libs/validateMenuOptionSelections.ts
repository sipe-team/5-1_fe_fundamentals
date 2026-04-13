import type { MenuOption, OptionSelection } from '@/features/menu/types';

export type ValidateMenuSelectionsResult = { ok: true } | { ok: false; message: string };

export function validateMenuOptionSelections(
  availableOptions: MenuOption[],
  optionSelections: OptionSelection[],
): ValidateMenuSelectionsResult {
  const labelsByOptionId = new Map(optionSelections.map((s) => [s.optionId, s.labels]));

  for (const option of availableOptions) {
    const labels = labelsByOptionId.get(option.id) ?? [];

    if (option.type === 'grid' && option.required && labels.length === 0) {
      return {
        ok: false,
        message: `${option.name}를(을) 선택해주세요`,
      };
    }

    if (option.type === 'select' && option.required && labels.length === 0) {
      return {
        ok: false,
        message: `${option.name}를(을) 선택해주세요`,
      };
    }

    if (option.type === 'list' && labels.length < option.minCount) {
      return {
        ok: false,
        message: `${option.name}을(를) ${option.minCount}개 이상 선택해주세요`,
      };
    }
  }

  return { ok: true };
}
