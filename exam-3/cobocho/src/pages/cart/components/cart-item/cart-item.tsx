import type { CartItem as CartItemType } from '@/domain/order/context/cart-context';
import { cartItemKey } from '@/domain/order/context/cart-context/cart-context.lib';
import { HStack, VStack } from '@/shared/components/layout';
import { NumericInput } from '@/shared/components/numeric-input';

interface CartItemProps {
	cartItem: CartItemType;
	onRemove: (key: string) => void;
	onUpdateQuantity: (key: string, quantity: number) => void;
}

export function CartItem({
	cartItem,
	onRemove,
	onUpdateQuantity,
}: CartItemProps) {
	const key = cartItemKey(cartItem.item.id, cartItem.options);
	const optionLabel = cartItem.options.flatMap((o) => o.labels).join(', ');

	return (
		<div className="border-b border-gray-100 p-4">
			<HStack
				justify="between"
				className="items-start"
			>
				<VStack
					gap={1}
					className="flex-1"
				>
					<span className="font-medium">{cartItem.item.title}</span>
					{optionLabel && (
						<span className="text-sm text-gray-500">{optionLabel}</span>
					)}
					<span className="text-sm font-medium">
						{cartItem.unitPrice.toLocaleString()}원
					</span>
				</VStack>
				<button
					type="button"
					className="ml-2 flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
					onClick={() => onRemove(key)}
					aria-label={`${cartItem.item.title} 삭제`}
				>
					✕
				</button>
			</HStack>

			<HStack
				justify="between"
				className="mt-3"
			>
				<NumericInput
					value={cartItem.quantity}
					onChange={(quantity) => onUpdateQuantity(key, quantity)}
				/>
				<span className="font-bold">
					{cartItem.totalPrice.toLocaleString()}원
				</span>
			</HStack>
		</div>
	);
}
