import { EmptyState } from '@/components/common/EmptyState';
import { useMenuItems } from '@/hooks/useMenuItems';
import type { MenuCategory } from '@/types/order';
import { MenuGrid } from './MenuGrid';

const MENU_SKELETON_IDS = [
  'menu-skeleton-1',
  'menu-skeleton-2',
  'menu-skeleton-3',
  'menu-skeleton-4',
  'menu-skeleton-5',
  'menu-skeleton-6',
] as const;

interface MenuListSectionProps {
  activeCategory: MenuCategory | null;
}

export function MenuListSection({ activeCategory }: MenuListSectionProps) {
  const { data: items } = useMenuItems();

  const filteredItems = activeCategory
    ? items.filter((item) => item.category === activeCategory)
    : items;

  if (filteredItems.length === 0) {
    return <EmptyState message="해당 카테고리에 메뉴가 없습니다." />;
  }

  return <MenuGrid items={filteredItems} />;
}

export function MenuListSkeleton() {
  return (
    <ul className="flex flex-col gap-3 px-4 pb-5" aria-hidden="true">
      {MENU_SKELETON_IDS.map((id) => (
        <li
          key={id}
          className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-3 shadow-sm"
        >
          <div className="h-24 w-24 shrink-0 animate-pulse rounded-lg bg-gray-200" />
          <div className="min-w-0 flex-1 space-y-3">
            <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
            <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
          </div>
        </li>
      ))}
    </ul>
  );
}
