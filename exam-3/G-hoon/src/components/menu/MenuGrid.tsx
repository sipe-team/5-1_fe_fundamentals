import type { MenuItem } from '@/types/order';
import { MenuCard } from './MenuCard';

interface MenuGridProps {
  items: MenuItem[];
}

export function MenuGrid({ items }: MenuGridProps) {
  return (
    <ul className="flex flex-col gap-3 px-4 pb-5">
      {items.map((item) => (
        <MenuCard key={item.id} item={item} />
      ))}
    </ul>
  );
}
