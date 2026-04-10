import { CategoryTab } from '@/domain/catalog/components/category-tab/category-tab';
import { useCategoryContext } from '@/domain/catalog/context/category-context';

export function MenuPage() {
	const { category, setCategory } = useCategoryContext();

	return (
		<div className="p-4">
			<CategoryTab
				value={category}
				onSelect={setCategory}
			/>
		</div>
	);
}
