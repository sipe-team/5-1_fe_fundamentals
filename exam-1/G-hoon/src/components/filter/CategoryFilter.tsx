import { createContext, useContext } from 'react';
import { useProductFilters } from '@/hooks/useProductFilters';
import type { Category } from '@/types/product';

const CATEGORY_ORDER: Category[] = ['shoes', 'tops', 'bottoms', 'accessories'];

function normalizeCategories(categories: Category[]) {
  return [...categories].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b),
  );
}

interface CategoryFilterContextValue {
  selected: Category[];
  toggle: (category: Category) => void;
  clearAll: () => void;
}

const CategoryFilterContext = createContext<CategoryFilterContextValue | null>(
  null,
);

function useCategoryFilterContext() {
  const context = useContext(CategoryFilterContext);
  if (!context) {
    throw new Error(
      'CategoryFilter compound components must be used within <CategoryFilter>',
    );
  }
  return context;
}

interface CategoryFilterProps {
  children: React.ReactNode;
}

function CategoryFilter({ children }: CategoryFilterProps) {
  const { categories, setCategories } = useProductFilters();

  const toggle = (category: Category) => {
    if (categories.includes(category)) {
      setCategories(
        normalizeCategories(categories.filter((c) => c !== category)),
      );
    } else {
      setCategories(normalizeCategories([...categories, category]));
    }
  };

  const clearAll = () => {
    setCategories([]);
  };

  return (
    <CategoryFilterContext.Provider
      value={{ selected: categories, toggle, clearAll }}
    >
      <fieldset className="flex items-center gap-1 overflow-x-auto scrollbar-hide md:gap-2">
        <legend className="sr-only">카테고리 필터</legend>
        {children}
      </fieldset>
    </CategoryFilterContext.Provider>
  );
}

interface ChipProps {
  value: Category;
  children: React.ReactNode;
}

function Chip({ value, children }: ChipProps) {
  const { selected, toggle } = useCategoryFilterContext();
  const isSelected = selected.includes(value);

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors md:px-4 md:py-1.5 md:text-sm ${
        isSelected
          ? 'border-black bg-black text-white'
          : 'border-gray-300 bg-white text-gray-700 hover:border-black'
      }`}
      onClick={() => toggle(value)}
    >
      {children}
    </button>
  );
}

function AllChip({ children }: { children: React.ReactNode }) {
  const { selected, clearAll } = useCategoryFilterContext();
  const isActive = selected.length === 0;

  return (
    <button
      type="button"
      aria-pressed={isActive}
      className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors md:px-4 md:py-1.5 md:text-sm ${
        isActive
          ? 'border-black bg-black text-white'
          : 'border-gray-300 bg-white text-gray-700 hover:border-black'
      }`}
      onClick={clearAll}
    >
      {children}
    </button>
  );
}

CategoryFilter.Chip = Chip;
CategoryFilter.AllChip = AllChip;

export default CategoryFilter;
