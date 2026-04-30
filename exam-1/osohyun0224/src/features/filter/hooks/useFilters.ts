import {
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs';
import { useCallback, useMemo, useTransition } from 'react';
import { ALL_CATEGORIES } from '@/shared/constants/product';
import type { Category, Product, SortOption } from '@/types';

const SORT_OPTIONS: SortOption[] = [
  'price_asc',
  'price_desc',
  'newest',
  'rating',
];

const filtersParsers = {
  categories: parseAsArrayOf(parseAsStringLiteral(ALL_CATEGORIES)).withDefault(
    [],
  ),
  keyword: parseAsString.withDefault(''),
  sort: parseAsStringLiteral(SORT_OPTIONS).withDefault('newest'),
};

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];
  switch (sort) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
}

export function useFilters(products: Product[]) {
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useQueryStates(filtersParsers, {
    shallow: false,
  });

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.categories.length > 0) {
      result = result.filter((product) =>
        filters.categories.includes(product.category),
      );
    }

    if (filters.keyword.trim()) {
      const lower = filters.keyword.toLowerCase();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(lower),
      );
    }

    result = sortProducts(result, filters.sort);
    return result;
  }, [products, filters]);

  const toggleCategory = useCallback(
    (category: Category) => {
      startTransition(() => {
        const has = filters.categories.includes(category);
        setFilters({
          categories: has
            ? filters.categories.filter((cat) => cat !== category)
            : [...filters.categories, category],
        });
      });
    },
    [filters.categories, setFilters],
  );

  const setKeyword = useCallback(
    (keyword: string) => {
      startTransition(() => {
        setFilters({ keyword: keyword || null });
      });
    },
    [setFilters],
  );

  const setSort = useCallback(
    (sort: SortOption) => {
      startTransition(() => {
        setFilters({ sort });
      });
    },
    [setFilters],
  );

  const resetFilters = useCallback(() => {
    startTransition(() => {
      setFilters(null);
    });
  }, [setFilters]);

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.keyword.trim() !== '' ||
    filters.sort !== 'newest';

  return {
    filters: {
      categories: filters.categories as Category[],
      keyword: filters.keyword,
      sort: filters.sort as SortOption,
    },
    filteredProducts,
    toggleCategory,
    setKeyword,
    setSort,
    resetFilters,
    hasActiveFilters,
    isPending,
  };
}
