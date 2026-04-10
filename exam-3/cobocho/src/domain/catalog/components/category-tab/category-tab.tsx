import { useSuspenseQuery } from '@tanstack/react-query';
import { cn } from '@/shared/lib/cn';
import { catalogQuery, type MenuCategory } from '../../api';

interface CategoryTabProps {
	value: MenuCategory;
	onSelect: (category: MenuCategory) => void;
}

export function CategoryTab({ value, onSelect }: CategoryTabProps) {
	const { data } = useSuspenseQuery(catalogQuery.categories());
	const categories = data.categories;

	return (
		<div role="tablist" className="flex gap-2">
			{categories.map((category) => (
				<button
					key={category}
					role="tab"
					type="button"
					aria-selected={value === category}
					className={cn(
						'rounded-full px-4 py-2 text-sm font-medium transition-colors',
						value === category
							? 'bg-black text-white'
							: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
					)}
					onClick={() => onSelect(category)}
				>
					{category}
				</button>
			))}
		</div>
	);
}
