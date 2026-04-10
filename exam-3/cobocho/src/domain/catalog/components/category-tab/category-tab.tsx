import { useSuspenseQuery } from '@tanstack/react-query';
import { catalogQuery, type MenuCategory } from '../../api';
import { SegmentControl } from '@/shared/components/segment-control';

interface CategoryTabProps {
	value?: MenuCategory | null;
	onSelect?: (category: MenuCategory) => void;
}

export function CategoryTab({ value, onSelect }: CategoryTabProps) {
	const { data } = useSuspenseQuery(catalogQuery.categories());
	const categories = data.categories;

	const resolvedValue =
		value && categories.includes(value) ? value : categories[0];

	return (
		<SegmentControl.Root
			value={resolvedValue}
			onSelect={(v) => onSelect?.(v as MenuCategory)}
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
