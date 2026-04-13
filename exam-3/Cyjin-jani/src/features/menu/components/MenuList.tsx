import type { MenuCategory } from '@/features/menu/types';
import { useMenuItems } from '@/features/menu/hooks/queries/useMenuItems';
import { groupByCategory } from '@/features/menu/libs/groupByCategory';
import { MenuCard } from './MenuCard';

interface MenuListProps {
  selectedCategory: MenuCategory;
}

export function MenuList({ selectedCategory }: MenuListProps) {
  const { data: items } = useMenuItems();
  const groupedItems = groupByCategory(items);
  const filteredItems = groupedItems[selectedCategory];
  const isEmpty = filteredItems.length === 0;

  if (isEmpty) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground text-sm">메뉴가 없어요😅</p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-3 p-4">
      {filteredItems.map((item) => (
        <li key={item.id}>
          <MenuCard item={item} />
        </li>
      ))}
    </ul>
  );
}
