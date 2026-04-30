import { CATEGORY_LABELS, SORT_LABELS } from '@/shared/constants/product';
import type { Category, ProductFilters } from '@/types';

interface ActiveFiltersProps {
  filters: ProductFilters;
  totalCount: number;
  hasActiveFilters: boolean;
  onRemoveCategory: (category: Category) => void;
  onClearKeyword: () => void;
  onResetAll: () => void;
}

export function ActiveFilters({
  filters,
  totalCount,
  hasActiveFilters,
  onRemoveCategory,
  onClearKeyword,
  onResetAll,
}: ActiveFiltersProps) {
  return (
    <div className="active-filters">
      <span className="result-count">{totalCount}개 상품</span>
      {hasActiveFilters && (
        <div className="filter-tags">
          {filters.categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className="filter-tag"
              onClick={() => onRemoveCategory(cat)}
            >
              {CATEGORY_LABELS[cat]} ✕
            </button>
          ))}
          {filters.keyword.trim() && (
            <button
              type="button"
              className="filter-tag"
              onClick={onClearKeyword}
            >
              "{filters.keyword}" ✕
            </button>
          )}
          {filters.sort !== 'newest' && (
            <span className="filter-tag sort-tag">
              {SORT_LABELS[filters.sort]}
            </span>
          )}
          <button type="button" className="reset-button" onClick={onResetAll}>
            필터 초기화
          </button>
        </div>
      )}
    </div>
  );
}
