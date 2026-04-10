import { useSuspenseQuery } from '@tanstack/react-query';
import { catalogQuery, type MenuItem } from '../../api';
import { SegmentControl } from '@/shared/components/segment-control';

interface CategoryTabProps {
	value: MenuItem['category'];
	onSelect?: (category: MenuItem['category']) => void;
}

export function CategoryTab({ value, onSelect }: CategoryTabProps) {
	const { data } = useSuspenseQuery(catalogQuery.categories());

	return (
		<SegmentControl.Root
			value={value}
			onSelect={(v) => onSelect?.(v)}
		>
			{data.categories.map((c) => (
				<SegmentControl.Item
					key={c}
					value={c}
				>
					{c}
				</SegmentControl.Item>
			))}
		</SegmentControl.Root>
	);
}
