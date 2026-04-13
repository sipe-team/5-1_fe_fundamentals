import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import type { MenuItem, MenuOption } from '@/domain/catalog/api';
import { useCartContext } from '@/domain/order/context/cart-context';
import { Button } from '@/shared/components/button';
import { CtaArea } from '@/shared/components/cta-area';
import { HStack, VStack } from '@/shared/components/layout';
import { NumericInput } from '@/shared/components/numeric-input';
import { Scaffold } from '@/shared/components/scaffold';
import { MenuDetailError } from './components/menu-detail-error';
import { MenuDetailSkeleton } from './components/menu-detail-skeleton';
import { MenuGridOption } from './components/menu-grid-option';
import { MenuListOption } from './components/menu-list-option';
import { MenuSelectOption } from './components/menu-select-option';
import { MenuInfo } from './components/menu-info';
import {
	useOptionContext,
	OptionProvider,
	validateSelections,
	flattenSelections,
} from './context/option-context';
import { useMenuOptions } from './hooks/use-menu-options';

export const MenuDetailPage = Scaffold.with(
	{
		error: <MenuDetailError />,
		fallback: <MenuDetailSkeleton />,
	},
	() => {
		const { itemId } = useParams<{ itemId: string }>();

		if (!itemId) {
			throw new Error('메뉴 ID가 존재하지 않습니다.');
		}

		const { item, options } = useMenuOptions(itemId);

		return (
			<div className="pb-24 p-4">
				<MenuInfo item={item} />
				<OptionProvider options={options}>
					<MenuOptions
						item={item}
						itemOptions={options}
					/>
				</OptionProvider>
			</div>
		);
	},
);

function MenuOptions({
	item,
	itemOptions,
}: {
	item: MenuItem;
	itemOptions: MenuOption[];
}) {
	const navigate = useNavigate();
	const { addItem } = useCartContext();
	const { selections, optionPrice, dispatch } = useOptionContext();

	const [quantity, setQuantity] = useState(1);

	function handleAddToCart() {
		const error = validateSelections(itemOptions, selections);

		if (error) {
			toast.warning(error);
			return;
		}

		addItem(item.id, flattenSelections(selections), quantity);
		navigate('/');
	}

	const unitPrice = item.price + optionPrice;
	const totalPrice = unitPrice * quantity;

	return (
		<VStack gap={6}>
			{itemOptions.map((option) => {
				switch (option.type) {
					case 'grid':
						return (
							<MenuGridOption
								key={option.id}
								option={option}
								selected={selections[option.id]?.[0] ?? null}
								onSelect={(label) =>
									dispatch({ type: 'grid', optionId: option.id, label })
								}
							/>
						);
					case 'select':
						return (
							<MenuSelectOption
								key={option.id}
								option={option}
								selected={selections[option.id]?.[0] ?? null}
								onSelect={(label) =>
									dispatch({
										type: 'select',
										optionId: option.id,
										label: label ?? '',
									})
								}
							/>
						);
					case 'list':
						return (
							<MenuListOption
								key={option.id}
								option={option}
								selected={selections[option.id] ?? []}
								onToggle={(label) =>
									dispatch({
										type: 'list',
										optionId: option.id,
										label,
										maxCount: option.maxCount,
									})
								}
							/>
						);
					default:
						return null;
				}
			})}

			<HStack
				justify="between"
				className="py-2"
			>
				<span className="text-sm font-medium text-gray-700">수량</span>
				<NumericInput
					value={quantity}
					onChange={setQuantity}
				/>
			</HStack>

			<CtaArea>
				<Button
					fullWidth
					size="lg"
					onClick={handleAddToCart}
				>
					{totalPrice.toLocaleString()}원 담기
				</Button>
			</CtaArea>
		</VStack>
	);
}
