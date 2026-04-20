import { createContext, type ReactNode, use } from 'react';
import { ChipButton } from '@/components/common/ChipButton';
import type { MenuCategory } from '@/types/order';

interface CategoryTabsProps {
  categories: MenuCategory[];
  activeCategory: MenuCategory | null;
  onSelect: (category: MenuCategory | null) => void;
}

interface CategoryTabsContextValue {
  activeCategory: MenuCategory | null;
  onSelect: (category: MenuCategory | null) => void;
}

interface CategoryTabsRootProps extends CategoryTabsContextValue {
  children: ReactNode;
}

interface CategoryChipProps {
  value: MenuCategory | null;
  children: ReactNode;
}

const CategoryTabsContext = createContext<CategoryTabsContextValue | null>(
  null,
);

function useCategoryTabsContext() {
  const context = use(CategoryTabsContext);

  if (!context) {
    throw new Error(
      'CategoryTabs compound components must be used within Root.',
    );
  }

  return context;
}

function CategoryTabsBase({
  categories,
  activeCategory,
  onSelect,
}: CategoryTabsProps) {
  return (
    <CategoryTabsRoot activeCategory={activeCategory} onSelect={onSelect}>
      <CategoryTabsFrame>
        <CategoryChip value={null}>전체</CategoryChip>
        {categories.map((category) => (
          <CategoryChip key={category} value={category}>
            {category}
          </CategoryChip>
        ))}
      </CategoryTabsFrame>
    </CategoryTabsRoot>
  );
}

function CategoryTabsRoot({
  activeCategory,
  onSelect,
  children,
}: CategoryTabsRootProps) {
  return (
    <CategoryTabsContext value={{ activeCategory, onSelect }}>
      {children}
    </CategoryTabsContext>
  );
}

function CategoryTabsFrame({ children }: { children: ReactNode }) {
  return (
    <nav aria-label="메뉴 카테고리">
      <div className="flex gap-2 overflow-x-auto px-4 py-3">{children}</div>
    </nav>
  );
}

function CategoryChip({ value, children }: CategoryChipProps) {
  const { activeCategory, onSelect } = useCategoryTabsContext();
  const selected = activeCategory === value;

  return (
    <ChipButton selected={selected} onClick={() => onSelect(value)}>
      {children}
    </ChipButton>
  );
}

export const CategoryTabs = Object.assign(CategoryTabsBase, {
  Root: CategoryTabsRoot,
  Frame: CategoryTabsFrame,
  Chip: CategoryChip,
});
