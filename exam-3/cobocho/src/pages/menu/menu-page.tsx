import { CategoryTab } from '@/domain/catalog/components/category-tab/category-tab';
import { MenuList } from '@/domain/catalog/components/menu-list';
import {
	CategoryProvider,
	useCategoryContext,
} from '@/domain/catalog/context/category-context';
import { VStack } from '@/shared/components/layout';
import { Scaffold } from '@/shared/components/scaffold';
import { CartButton } from './components/cart-button';
import { MenuPageError } from './components/menu-page-error';
import { MenuPageSkeleton } from './components/menu-page-skeleton';

export const MenuPage = Scaffold.with(
	{
		error: <MenuPageError />,
		fallback: <MenuPageSkeleton />,
	},
	() => {
		return (
			<CategoryProvider>
				<MenuPageContent />
			</CategoryProvider>
		);
	},
);

const MenuPageContent = () => {
	const { category, setCategory } = useCategoryContext();

	return (
		<VStack className="p-4 pb-10">
			<CategoryTab
				value={category}
				onSelect={setCategory}
			/>
			<MenuList category={category} />
			<CartButton />
		</VStack>
	);
};
