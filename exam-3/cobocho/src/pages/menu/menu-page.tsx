import { useNavigate } from 'react-router-dom';

import { CategoryTab } from '@/domain/catalog/components/category-tab/category-tab';
import { MenuList } from '@/domain/catalog/components/menu-list';
import { useCategoryContext } from '@/domain/catalog/context/category-context';
import { VStack } from '@/shared/components/layout';
import { CartButton } from './components/cart-button';

export function MenuPage() {
	const navigate = useNavigate();

	const { category, setCategory } = useCategoryContext();

	return (
		<VStack className="p-4 pb-10">
			<CategoryTab
				value={category}
				onSelect={setCategory}
			/>
			<MenuList
				category={category}
				onClickMenu={(item) => navigate(`/menu/${item.id}`)}
			/>
			<CartButton />
		</VStack>
	);
}
