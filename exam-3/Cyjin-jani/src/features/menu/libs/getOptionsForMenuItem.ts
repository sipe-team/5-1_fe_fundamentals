import type { MenuItem, MenuOption } from '@/features/menu/types';

export function getOptionsForMenuItem(item: MenuItem, allOptions: MenuOption[]): MenuOption[] {
  const optionById = new Map<number, MenuOption>(allOptions.map((option) => [option.id, option]));

  return item.optionIds
    .map((id) => optionById.get(id))
    .filter((option): option is MenuOption => option !== undefined);
}
