import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { getProducts } from '@/apis';
import type { ProductListResponse, SortOption } from '@/types';

interface UseProductListProps {
  keyword?: string;
  categories?: string;
  sort: SortOption;
  size?: number;
}

function normalizeQueryValue(value?: string) {
  return value?.trim() ?? '';
}

function normalizePageSize(size = 10) {
  return Number.isInteger(size) && size > 0 ? size : 10;
}

const PRODUCT_QUERY_KEY = ({
  keyword,
  categories,
  sort,
  size,
}: Required<UseProductListProps>) => [
  'products',
  keyword,
  categories,
  sort,
  size,
];

function getNextPageParam(lastPage: ProductListResponse) {
  return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
}

export default function useProductList({
  keyword,
  categories,
  sort,
  size = 10,
}: UseProductListProps) {
  const normalizedKeyword = normalizeQueryValue(keyword);
  const normalizedCategories = normalizeQueryValue(categories);
  const normalizedSize = normalizePageSize(size);

  const query = useSuspenseInfiniteQuery({
    queryKey: PRODUCT_QUERY_KEY({
      keyword: normalizedKeyword,
      categories: normalizedCategories,
      sort,
      size: normalizedSize,
    }),
    queryFn: ({ pageParam = 1 }) =>
      getProducts({
        page: pageParam,
        keyword: normalizedKeyword,
        categories: normalizedCategories,
        sort,
        size: normalizedSize,
      }),
    initialPageParam: 1,
    getNextPageParam,
    select: (data) => {
      const firstPage = data.pages[0];
      const lastPage = data.pages.at(-1);

      return {
        products: data.pages.flatMap((page) => page.products),
        total: firstPage?.total ?? 0,
        page: lastPage?.page ?? 1,
        size: firstPage?.size ?? normalizedSize,
        totalPages: firstPage?.totalPages ?? 0,
      };
    },
  });

  const loadMore = () => {
    if (!query.hasNextPage || query.isFetchingNextPage) {
      return;
    }

    void query.fetchNextPage();
  };

  return {
    ...query,
    loadMore,
  };
}

useProductList.getQueryKeys = ({
  keyword,
  categories,
  sort,
  size = 10,
}: UseProductListProps) =>
  PRODUCT_QUERY_KEY({
    keyword: normalizeQueryValue(keyword),
    categories: normalizeQueryValue(categories),
    sort,
    size: normalizePageSize(size),
  });
