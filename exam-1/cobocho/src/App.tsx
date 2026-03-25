import './App.css';
import type {
	Category,
	ProductsRequest,
	ProductsSortOption,
} from './domain/products/api/products.types';
import {
	CATEGORY_LABELS,
	SORT_OPTION_LABELS,
	categorySchema,
	productsSortOptionSchema,
} from './domain/products/api/products.types';
import {
	parseAsArrayOf,
	parseAsEnum,
	parseAsInteger,
	parseAsString,
	useQueryStates,
} from './hooks/use-query-state';
import { cn } from './libs/cn';

const productsQuerySchema = {
	categories: parseAsArrayOf(parseAsEnum(categorySchema.options))
		.nullable()
		.withDefault(null),
	keyword: parseAsString.nullable().withDefault(null),
	sort: parseAsEnum(productsSortOptionSchema.options)
		.nullable()
		.withDefault(null),
	page: parseAsInteger.withDefault(1),
	size: parseAsInteger.withDefault(20),
};

function App() {
	const [filters, setFilters] =
		useQueryStates<ProductsRequest>(productsQuerySchema);

	const categories = filters.categories ?? [];

	const toggleCategory = (category: Category) => {
		const next = categories.includes(category)
			? categories.filter((c) => c !== category)
			: [...categories, category];
		setFilters({ categories: next });
	};

	const resetFilters = () => {
		setFilters({
			categories: null,
			keyword: null,
			sort: null,
			page: 1,
			size: 20,
		});
	};

	return (
		<div>
			<div className="flex items-center gap-4">
				<label>
					검색어
					<input
						type="text"
						value={filters.keyword ?? ''}
						onChange={(e) => setFilters({ keyword: e.target.value || null })}
					/>
				</label>
				<div className="flex gap-2 items-center">
					{(Object.keys(CATEGORY_LABELS) as Category[]).map((category) => (
						<label
							key={category}
							className="flex items-center gap-1"
						>
							<input
								type="checkbox"
								checked={categories.includes(category)}
								onChange={() => toggleCategory(category)}
							/>
							{CATEGORY_LABELS[category]}
						</label>
					))}
				</div>
				<fieldset
					className="flex gap-1"
					aria-label="정렬"
				>
					{(Object.keys(SORT_OPTION_LABELS) as ProductsSortOption[]).map(
						(option) => (
							<button
								key={option}
								type="button"
								className={cn(
									'rounded px-2 py-1 text-sm',
									filters.sort === option ? 'text-black' : 'text-gray-400',
								)}
								onClick={() =>
									setFilters({
										sort: filters.sort === option ? null : option,
									})
								}
							>
								{SORT_OPTION_LABELS[option]}
							</button>
						),
					)}
				</fieldset>
				<button
					type="button"
					onClick={resetFilters}
				>
					초기화
				</button>
			</div>
			<div>
				<span>상품 목록</span>
			</div>
		</div>
	);
}

export default App;
