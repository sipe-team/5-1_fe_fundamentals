import { useSearchParams } from 'react-router-dom';
import { isSortOption, type SortOption } from '@/types';

export interface ProductQueryState {
  search?: string;
  categories?: string;
  sort?: SortOption;
}

const PRODUCT_QUERY_KEYS = [
  'search',
  'categories',
  'sort',
] as const satisfies readonly (keyof ProductQueryState)[];

type ProductQueryPatch = {
  [Key in keyof ProductQueryState]?: ProductQueryState[Key] | undefined;
};

function normalizeQueryValue(value: string | null) {
  const normalizedValue = value?.trim();
  return normalizedValue ? normalizedValue : undefined;
}

function readProductQuery(searchParams: URLSearchParams): ProductQueryState {
  const rawSort = searchParams.get('sort');

  return {
    search: normalizeQueryValue(searchParams.get('search')),
    categories: normalizeQueryValue(searchParams.get('categories')),
    sort: isSortOption(rawSort) ? rawSort : undefined,
  };
}

export default function useRouteParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentQuery = readProductQuery(searchParams);

  const updateQuery = (queries: ProductQueryPatch) => {
    const nextParams = new URLSearchParams(searchParams);

    for (const [key, value] of Object.entries(queries) as Array<
      [keyof ProductQueryState, string | undefined]
    >) {
      const normalizedValue =
        typeof value === 'string' ? value.trim() : (value ?? undefined);

      if (!normalizedValue) {
        nextParams.delete(key);
        continue;
      }

      nextParams.set(key, normalizedValue);
    }

    setSearchParams(nextParams);
  };

  const resetQuery = () => {
    const nextParams = new URLSearchParams(searchParams);

    for (const key of PRODUCT_QUERY_KEYS) {
      nextParams.delete(key);
    }

    setSearchParams(nextParams);
  };

  return {
    currentQuery,
    updateQuery,
    resetQuery,
  };
}
