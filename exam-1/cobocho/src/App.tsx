import './App.css';
import { VStack } from '@/components/layout';
import type { ProductsRequest } from './domain/products/api/products.types';
import {
	categorySchema,
	productsSortOptionSchema,
} from './domain/products/api/products.types';
import { ProductSearchFilter } from './domain/products/components/product-search-filter';
import { ProductsInfinityList } from './domain/products/components/products-infinity-list/products-infinity-list';
import {
	parseAsArrayOf,
	parseAsEnum,
	parseAsInteger,
	parseAsString,
	useQueryStates,
} from './hooks/use-query-state';
import { DEFAULT_PRODUCTS_REQUEST } from './domain/products/components/product-search-filter/product-search-filter.constants';

function App() {
	const [filters, setFilters] = useQueryStates<ProductsRequest>({
		categories: parseAsArrayOf(parseAsEnum(categorySchema.options))
			.nullable()
			.withDefault(DEFAULT_PRODUCTS_REQUEST.categories),
		keyword: parseAsString
			.nullable()
			.withDefault(DEFAULT_PRODUCTS_REQUEST.keyword),
		sort: parseAsEnum(productsSortOptionSchema.options)
			.nullable()
			.withDefault(DEFAULT_PRODUCTS_REQUEST.sort),
		page: parseAsInteger.withDefault(DEFAULT_PRODUCTS_REQUEST.page),
		size: parseAsInteger.withDefault(DEFAULT_PRODUCTS_REQUEST.size),
	});

	return (
		<VStack
			gap={6}
			className="mx-auto max-w-4xl px-4 py-8"
		>
			<h1 className="text-2xl font-bold">상품 목록</h1>
			<VStack gap={2}>
				<ProductSearchFilter
					value={filters}
					onChange={setFilters}
				/>
				<ProductsInfinityList options={filters} />
			</VStack>
		</VStack>
	);
}

export default App;
