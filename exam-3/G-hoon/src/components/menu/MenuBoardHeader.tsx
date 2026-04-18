import { ChipButton } from '@/components/common/ChipButton';
import { useCategories } from '@/hooks/useCategories';
import type { MenuCategory } from '@/types/order';
import { CategoryTabs } from './CategoryTabs';

const CATEGORY_TAB_SKELETON_IDS = [
  'category-tab-skeleton-1',
  'category-tab-skeleton-2',
  'category-tab-skeleton-3',
  'category-tab-skeleton-4',
] as const;

export function CategoryTabList({
  activeCategory,
  onSelect,
}: {
  activeCategory: MenuCategory | null;
  onSelect: (category: MenuCategory | null) => void;
}) {
  const { data: categories } = useCategories();

  return (
    <CategoryTabs.Root activeCategory={activeCategory} onSelect={onSelect}>
      <CategoryTabs.Frame>
        <CategoryTabs.Chip value={null}>전체</CategoryTabs.Chip>
        {categories.map((category) => (
          <CategoryTabs.Chip key={category} value={category}>
            {category}
          </CategoryTabs.Chip>
        ))}
      </CategoryTabs.Frame>
    </CategoryTabs.Root>
  );
}

export function CategoryTabsSkeleton() {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3" aria-hidden="true">
      {CATEGORY_TAB_SKELETON_IDS.map((id) => (
        <div
          key={id}
          className="h-10 w-16 animate-pulse rounded-lg bg-gray-100"
        />
      ))}
    </div>
  );
}

export function CategoryTabsErrorFallback({
  onReset,
}: {
  onReset: () => void;
}) {
  return (
    <div className="px-4 py-3">
      <div className="flex gap-2 overflow-x-auto">
        <ChipButton selected>전체</ChipButton>
        <ChipButton onClick={onReset}>메뉴 다시 불러오기</ChipButton>
      </div>
      <p className="mt-1 text-xs text-red-400">
        메뉴 정보를 불러오는데 실패했습니다.
      </p>
    </div>
  );
}
