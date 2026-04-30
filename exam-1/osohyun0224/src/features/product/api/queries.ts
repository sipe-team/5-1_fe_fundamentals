import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/features/product/api/fetchProducts';
import { productsQuery } from '@/shared/api/queryKeys';

export function useProducts() {
  return useSuspenseQuery({
    queryKey: productsQuery.lists(),
    queryFn: fetchProducts,
  });
}
