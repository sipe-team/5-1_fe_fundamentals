import { Card } from '@/components/card/card';
import { HStack, VStack } from '@/components/layout';
import {
	ToggleGroup,
	ToggleGroupItem,
} from '@/components/toggle-group/toggle-group';
import type {
	Category,
	ProductsRequest,
	ProductsSortOption,
} from '../../api/products.types';
import { CATEGORY_LABELS, SORT_OPTION_LABELS } from '../../api/products.types';
import { ProductAutoComplete } from '../product-autocomplete/product-autocomplete';
import { DEFAULT_PRODUCTS_REQUEST } from './product-search-filter.constants';

interface ProductSearchFilterProps {
	value: ProductsRequest;
	onChange: (value: Partial<ProductsRequest>) => void;
}

export const ProductSearchFilter = ({
	value,
	onChange,
}: ProductSearchFilterProps) => {
	const resetFilters = () => {
		onChange(DEFAULT_PRODUCTS_REQUEST);
	};

	return (
		<Card>
			<VStack gap={4}>
				<ProductAutoComplete
					value={value.keyword ?? ''}
					onChange={(keyword) => onChange({ keyword: keyword || null })}
				/>
				<HStack
					gap={4}
					wrap
				>
					<HStack gap={2}>
						<span className="text-sm font-medium text-gray-500">카테고리</span>
						<ToggleGroup
							type="multiple"
							value={value.categories ?? []}
							onChange={(next) =>
								onChange({
									categories: next.length > 0 ? (next as Category[]) : null,
								})
							}
						>
							{Object.entries(CATEGORY_LABELS).map(([category, label]) => (
								<ToggleGroupItem
									key={category}
									value={category}
								>
									{label}
								</ToggleGroupItem>
							))}
						</ToggleGroup>
					</HStack>
					<div className="h-5 w-px bg-gray-200" />
					<HStack gap={2}>
						<span className="text-sm font-medium text-gray-500">정렬</span>
						<ToggleGroup
							type="single"
							value={value.sort}
							onChange={(next) =>
								onChange({ sort: next as ProductsSortOption | null })
							}
						>
							{Object.entries(SORT_OPTION_LABELS).map(([option, label]) => (
								<ToggleGroupItem
									key={option}
									value={option}
								>
									{label}
								</ToggleGroupItem>
							))}
						</ToggleGroup>
					</HStack>
					<button
						type="button"
						className="ml-auto rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100"
						onClick={resetFilters}
					>
						초기화
					</button>
				</HStack>
			</VStack>
		</Card>
	);
};
