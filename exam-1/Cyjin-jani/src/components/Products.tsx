import { Suspense } from 'react';
import { useProductFilters } from '@/hooks/useProductFilters';
import type { ProductFilters as ProductFiltersType } from '@/types/product';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from './ProductCard';
import { ProductFilters } from './ProductFilters';

export const Products = () => {
  const { filters } = useProductFilters();

  return (
    <div className="w-full max-w-[860px] mx-auto px-4 py-6">
      <ProductFilters />
      <Suspense fallback={<LoadingFallback />}>
        <ProductList filters={filters} />
      </Suspense>
    </div>
  );
};

const LoadingFallback = () => (
  <div className="grid grid-cols-4 gap-4 mt-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={`loading-${
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          i
        }`}
        className="h-[300px] rounded-lg bg-gray-200 animate-pulse"
      />
    ))}
  </div>
);

const ProductList = ({ filters }: { filters: ProductFiltersType }) => {
  const { data } = useProducts(filters);
  return (
    <div className="grid grid-cols-4 gap-4 mt-6">
      {data.products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
