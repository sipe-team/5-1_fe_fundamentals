import { useSuspenseQuery } from '@tanstack/react-query';
import { catalogQuery, type MenuCategory } from '../../api';
import { SegmentControl } from '@/shared/components/segment-control';

interface CategoryTabProps {
	value: MenuCategory;
	onSelect: (category: MenuCategory) => void;
}

export function CategoryTab({ value, onSelect }: CategoryTabProps) {
	const { data } = useSuspenseQuery(catalogQuery.categories());
	const categories = data.categories;

	return (
		<SegmentControl.Root
			value={value}
			onSelect={(v) => onSelect(v as MenuCategory)}
		>
			{categories.map((category) => (
				<SegmentControl.Item
					key={category}
					value={category}
				>
					{category}
				</SegmentControl.Item>
			))}
		</SegmentControl.Root>
	);
}
