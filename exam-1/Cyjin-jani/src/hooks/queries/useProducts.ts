import { useSuspenseQuery } from '@tanstack/react-query';
import type { Product, ProductFilters } from '@/types/product';

const GET_PRODUCTS_URL = '/api/products';
const COMMON_FETCH_ERROR = 'Network response was not ok';

interface IProductsResponse {
  products: Product[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

const fetchProducts = async (
  filters: ProductFilters,
): Promise<IProductsResponse> => {
  const params = new URLSearchParams();

  if (filters.keyword) params.set('keyword', filters.keyword);
  if (filters.categories.length > 0)
    params.set('categories', filters.categories.join(','));
  if (filters.sort) params.set('sort', filters.sort);

  const response = await fetch(`${GET_PRODUCTS_URL}?${params.toString()}`);
  if (!response.ok) throw new Error(COMMON_FETCH_ERROR);

  return response.json();
};

export const useProducts = (filters: ProductFilters) => {
  const { keyword, sort, categories } = filters;

  return useSuspenseQuery({
    queryKey: ['products', keyword, sort, categories.join(',')],
    queryFn: () => fetchProducts(filters),
    select: (data: IProductsResponse) => data.products,
  });
};
