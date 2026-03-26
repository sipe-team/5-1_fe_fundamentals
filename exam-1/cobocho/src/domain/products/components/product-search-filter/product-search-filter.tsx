import type {
	Category,
	ProductsRequest,
	ProductsSortOption,
} from '../../api/products.types';
import { CATEGORY_LABELS, SORT_OPTION_LABELS } from '../../api/products.types';
import { ProductAutoComplete } from '../product-autocomplete/product-autocomplete';
import { cn } from '@/libs/cn';

interface ProductSearchFilterProps {
	value: ProductsRequest;
	onChange: (value: Partial<ProductsRequest>) => void;
}

export const ProductSearchFilter = ({
	value,
	onChange,
}: ProductSearchFilterProps) => {
	const categories = value.categories ?? [];

	const toggleCategory = (category: Category) => {
		const next = categories.includes(category)
			? categories.filter((c) => c !== category)
			: [...categories, category];
		onChange({ categories: next.length > 0 ? next : null });
	};

	const resetFilters = () => {
		onChange({
			categories: null,
			keyword: null,
			sort: null,
			page: 1,
			size: 20,
		});
	};

	return (
		<div className="flex items-center gap-4">
			<ProductAutoComplete
				value={value.keyword ?? ''}
				onChange={(keyword) => onChange({ keyword: keyword || null })}
			/>
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
								value.sort === option ? 'text-black' : 'text-gray-400',
							)}
							onClick={() =>
								onChange({
									sort: value.sort === option ? null : option,
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
	);
};
