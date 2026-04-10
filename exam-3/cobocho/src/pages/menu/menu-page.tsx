import { useQueryState } from 'nuqs';
import type { MenuCategory } from '@/domain/catalog/api';
import { CategoryTab } from '@/domain/catalog/components/category-tab/category-tab';

export function MenuPage() {
	const [category, setCategory] = useQueryState('category');

	return (
		<div>
			<CategoryTab
				value={category as MenuCategory}
				onSelect={setCategory}
			/>
		</div>
	);
}
