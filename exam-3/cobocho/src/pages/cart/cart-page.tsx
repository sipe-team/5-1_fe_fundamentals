import { useNavigate } from 'react-router-dom';

import { useCartContext } from '@/domain/order/context/cart-context';
import { cartItemKey } from '@/domain/order/context/cart-context/cart-context.lib';
import { Button } from '@/shared/components/button';
import { CtaArea } from '@/shared/components/cta-area';
import { HStack, VStack } from '@/shared/components/layout';
import { CartItem } from './components/cart-item';
import { EmptyCart } from './components/empty-cart';

export function CartPage() {
	const navigate = useNavigate();
	const { items, removeItem, updateQuantity, totalPrice } = useCartContext();

	const isEmpty = items.length === 0;

	return (
		<div className="pb-24">
			<div className="border-b border-gray-200 p-4">
				<h1 className="text-lg font-bold">장바구니</h1>
			</div>

			{isEmpty ? (
				<EmptyCart />
			) : (
				<VStack gap={0}>
					{items.map((cartItem) => (
						<CartItem
							key={cartItemKey(cartItem.item.id, cartItem.options)}
							cartItem={cartItem}
							onRemove={removeItem}
							onUpdateQuantity={updateQuantity}
						/>
					))}
				</VStack>
			)}

			{!isEmpty && (
				<CtaArea>
					<VStack gap={2}>
						<HStack
							justify="between"
							className="px-1"
						>
							<span className="text-sm text-gray-500">총 금액</span>
							<span className="text-lg font-bold">
								{totalPrice.toLocaleString()}원
							</span>
						</HStack>
						<Button
							fullWidth
							size="lg"
							onClick={() => navigate('/orders')}
						>
							{totalPrice.toLocaleString()}원 주문하기
						</Button>
					</VStack>
				</CtaArea>
			)}
		</div>
	);
}
