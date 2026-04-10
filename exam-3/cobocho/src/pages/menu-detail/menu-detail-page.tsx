import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
	catalogQuery,
	type MenuItem,
	type MenuOption,
} from '@/domain/catalog/api';
import { useCartContext } from '@/domain/order/context/cart-context';
import { MenuInfo } from './components/menu-info';
import { MenuGridOption } from './components/menu-grid-option';
import { MenuSelectOption } from './components/menu-select-option';
import { MenuListOption } from './components/menu-list-option';
import { QuantitySelector } from './components/quantity-selector';
import { useMenuOptions } from './hooks/use-menu-options';
import {
	useOptionContext,
	OptionProvider,
	validateSelections,
	flattenSelections,
} from './context/option-context';
import { VStack } from '@/shared/components/layout';
import { Button } from '@/shared/components/button';
import { CtaArea } from '@/shared/components/cta-area';
import { useSuspenseQuery } from '@tanstack/react-query';

export function MenuDetailPage() {
	const { itemId } = useParams<{ itemId: string }>();

	if (!itemId) {
		throw new Error('Item ID is required');
	}

	const { data } = useSuspenseQuery(catalogQuery.item(itemId));
	const { options } = useMenuOptions(itemId);

	return (
		<div className="pb-24 p-4">
			<MenuInfo item={data.item} />
			<OptionProvider options={options}>
				<MenuOptions
					item={data.item}
					itemOptions={options}
				/>
			</OptionProvider>
		</div>
	);
}

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

		addItem(item, flattenSelections(selections), quantity);
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

			<QuantitySelector
				quantity={quantity}
				onChange={setQuantity}
			/>

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
