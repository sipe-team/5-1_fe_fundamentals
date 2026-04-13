import type { MenuCategory, MenuItem } from '@/features/menu/types';

export function groupByCategory(items: MenuItem[]): Record<MenuCategory, MenuItem[]> {
  return items.reduce<Record<MenuCategory, MenuItem[]>>(
    (acc, item) => {
      acc[item.category].push(item);
      return acc;
    },
    { 커피: [], 음료: [], 디저트: [] },
  );
}
