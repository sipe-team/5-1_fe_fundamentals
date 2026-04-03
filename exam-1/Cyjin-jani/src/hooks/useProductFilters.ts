import { useTransition } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Category, SortOption } from '@/types/product';

/** URL·쿼리키가 선택 순서에 따라 달라지지 않도록 고정 순서 유지 */
const CATEGORY_ORDER: Category[] = ['accessories', 'bottoms', 'shoes', 'tops'];

const sortCategories = (categories: Category[]): Category[] =>
  [...categories].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b),
  );

export interface ProductFiltersReturn {
  filters: {
    categories: Category[];
    keyword: string;
    sort: SortOption;
  };
  isPending: boolean;
  hasActiveFilters: boolean;
  setKeyword: (keyword: string) => void;
  toggleCategory: (category: Category) => void;
  setSort: (sort: SortOption) => void;
  resetFilters: () => void;
}

const DEFAULT_SORT = 'newest';

export const useProductFilters = (): ProductFiltersReturn => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const filters = {
    categories: sortCategories(searchParams.getAll('category') as Category[]),
    keyword: searchParams.get('keyword') ?? '',
    sort: (searchParams.get('sort') as SortOption) ?? DEFAULT_SORT,
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.keyword !== '' ||
    filters.sort !== DEFAULT_SORT;

  const setKeyword = (keyword: string) => {
    startTransition(() => {
      setSearchParams((params) => {
        const trimmed = keyword.trim();
        if (trimmed) {
          params.set('keyword', trimmed);
        } else {
          params.delete('keyword');
        }
        return params;
      });
    });
  };

  const toggleCategory = (category: Category) => {
    startTransition(() => {
      setSearchParams((params) => {
        const current = params.getAll('category') as Category[];
        const next = sortCategories(
          current.includes(category)
            ? current.filter((c) => c !== category)
            : [...current, category],
        );

        params.delete('category');
        next.forEach((c) => {
          params.append('category', c);
        });

        return params;
      });
    });
  };

  const setSort = (sort: SortOption) => {
    startTransition(() => {
      setSearchParams((params) => {
        params.set('sort', sort);
        return params;
      });
    });
  };

  const resetFilters = () => {
    startTransition(() => {
      setSearchParams(new URLSearchParams());
    });
  };

  return {
    filters,
    isPending,
    hasActiveFilters,
    setKeyword,
    toggleCategory,
    setSort,
    resetFilters,
  };
};
