import { useCallback, useMemo, useSyncExternalStore } from 'react';
import type {
  Category,
  Product,
  ProductFilters,
  SortOption,
} from '@/types';
import { ALL_CATEGORIES } from '@/shared/constants/product';

const VALID_SORTS: SortOption[] = ['price_asc', 'price_desc', 'newest', 'rating'];

function getSearchParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

function parseFilters(params: URLSearchParams): ProductFilters {
  const categories = params
    .getAll('categories')
    .filter((c) => ALL_CATEGORIES.includes(c as Category)) as Category[];

  const keyword = params.get('keyword') ?? '';

  const sortParam = params.get('sort');
  const sort: SortOption = VALID_SORTS.includes(sortParam as SortOption)
    ? (sortParam as SortOption)
    : 'newest';

  return { categories, keyword, sort };
}

function buildSearch(filters: ProductFilters): string {
  const parts: string[] = [];

  for (const cat of filters.categories) {
    parts.push(`categories=${cat}`);
  }
  if (filters.keyword.trim()) {
    parts.push(`keyword=${encodeURIComponent(filters.keyword)}`);
  }
  if (filters.sort !== 'newest') {
    parts.push(`sort=${filters.sort}`);
  }

  return parts.length > 0 ? parts.join('&') : '';
}

function setSearchParams(filters: ProductFilters) {
  const search = buildSearch(filters);
  const url = search ? `${window.location.pathname}?${search}` : window.location.pathname;
  window.history.pushState(null, '', url);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback);
  return () => window.removeEventListener('popstate', callback);
}

function getSnapshot() {
  return window.location.search;
}

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
  const search = useSyncExternalStore(subscribe, getSnapshot);

  const filters = useMemo(() => parseFilters(getSearchParams()), [search]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.categories.length > 0) {
      result = result.filter((product) => filters.categories.includes(product.category));
    }

    if (filters.keyword.trim()) {
      const lower = filters.keyword.toLowerCase();
      result = result.filter((product) => product.name.toLowerCase().includes(lower));
    }

    result = sortProducts(result, filters.sort);
    return result;
  }, [products, filters]);

  const toggleCategory = useCallback((category: Category) => {
    const current = parseFilters(getSearchParams());
    const has = current.categories.includes(category);
    setSearchParams({
      ...current,
      categories: has
        ? current.categories.filter((cat) => cat !== category)
        : [...current.categories, category],
    });
  }, []);

  const setKeyword = useCallback((keyword: string) => {
    const current = parseFilters(getSearchParams());
    setSearchParams({ ...current, keyword });
  }, []);

  const setSort = useCallback((sort: SortOption) => {
    const current = parseFilters(getSearchParams());
    setSearchParams({ ...current, sort });
  }, []);

  const resetFilters = useCallback(() => {
    setSearchParams({ categories: [], keyword: '', sort: 'newest' });
  }, []);

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.keyword.trim() !== '' ||
    filters.sort !== 'newest';

  return {
    filters,
    filteredProducts,
    toggleCategory,
    setKeyword,
    setSort,
    resetFilters,
    hasActiveFilters,
  };
}
