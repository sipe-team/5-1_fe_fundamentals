import { cn } from '@/shared/lib/utils';
import type { MenuCategory } from '@/features/menu/types';

interface CategoryTabsProps {
  categories: MenuCategory[];
  selectedCategory: MenuCategory;
  onCategoryChange: (category: MenuCategory) => void;
}

export function CategoryTabs({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="flex gap-2 border-b border-border px-4">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onCategoryChange(category)}
          className={cn(
            'px-4 py-3 text-sm font-medium transition-colors',
            selectedCategory === category
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
