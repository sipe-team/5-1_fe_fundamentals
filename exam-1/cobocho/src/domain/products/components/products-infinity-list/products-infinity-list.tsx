/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import InfinityScroll from '@/components/infinity-scroll/infinity-scroll';
import { Grid } from '@/components/layout';
import { VStack } from '@/components/layout';
import { productsQuery } from '../../api/products.query';
import type { ProductsRequest } from '../../api/products.types';
import { ProductCard } from '../product-card/product-card';
import { Skeleton } from '@/components/skeleton';
import { Card } from '@/components/card';

interface ProductsInfinityListProps {
	options: ProductsRequest;
}

export const ProductsInfinityList = ({
	options,
}: ProductsInfinityListProps) => {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
	} = useInfiniteQuery(productsQuery.getInfiniteProductsQueryOptions(options));

	const handleFetchMore = useCallback(async () => {
		await fetchNextPage();
	}, [fetchNextPage]);

	const products = data?.pages.flatMap((page) => page.products) ?? [];

	const isBlank = !isError && !isLoading && products.length === 0;

	if (isLoading) {
		return <ProductListSkeleton />;
	}

	if (isError) {
		return (
			<VStack align="center" className="py-12 text-gray-400">
				<p>문제가 발생했습니다</p>
				<button
					type="button"
					className="rounded-md border border-gray-300 px-4 py-1.5 text-sm transition-colors hover:bg-gray-100"
					onClick={() => fetchNextPage()}
				>
					다시 시도
				</button>
			</VStack>
		);
	}

	return (
		<InfinityScroll
			onFetchMore={handleFetchMore}
			error={isError}
			disabled={!hasNextPage || isError || isBlank}
			loading={isFetchingNextPage}
		>
			<Grid
				columns={2}
				gap={4}
			>
				{products.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
					/>
				))}
			</Grid>
			{isBlank && (
				<VStack
					align="center"
					className="py-12 text-gray-400"
				>
					<p>검색 결과가 없습니다.</p>
				</VStack>
			)}
		</InfinityScroll>
	);
};

function ProductListSkeleton() {
	return (
		<Grid
			columns={2}
			gap={4}
		>
			{Array.from({ length: 10 }, (_, i) => (
				<Card
					key={i}
					className="overflow-hidden p-0"
				>
					<Skeleton className="aspect-square w-full" />
					<VStack
						gap={1}
						className="p-3"
					>
						<Skeleton className="h-5 w-3/4" />
						<Skeleton className="h-4 w-1/2" />
						<Skeleton className="h-3 w-full" />
					</VStack>
				</Card>
			))}
		</Grid>
	);
}
