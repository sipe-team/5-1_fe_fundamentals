import type { MenuItem } from '@/domain/catalog/api';
import type { CartItem as CartItemType } from '@/domain/order/context/cart-context';
import {
	type CartItemStatus,
	calcUnitPrice,
	cartItemKey,
} from '@/domain/order/context/cart-context/cart-context.lib';
import { HStack, VStack } from '@/shared/components/layout';
import { NumericInput } from '@/shared/components/numeric-input';
import type { MenuOption } from '@/types/order';

interface CartItemProps {
	cartItem: CartItemType;
	menuItem: MenuItem;
	allOptions: MenuOption[];
	status: CartItemStatus;
	onRemove: (key: string) => void;
	onUpdateQuantity: (key: string, quantity: number) => void;
}

export function CartItem({
	cartItem,
	menuItem,
	allOptions,
	status,
	onRemove,
	onUpdateQuantity,
}: CartItemProps) {
	const key = cartItemKey(cartItem.itemId, cartItem.options);
	const unitPrice = calcUnitPrice(menuItem, cartItem.options, allOptions);
	const optionLabel = cartItem.options.flatMap((o) => o.labels).join(', ');
	const totalPrice = unitPrice * cartItem.quantity;
	const isInvalid = status.kind === 'invalid';

	return (
		<div
			className={`border-gray-100 border-b p-4 ${isInvalid ? 'bg-amber-50' : ''}`}
		>
			<HStack
				justify="between"
				className="items-start"
			>
				<VStack
					gap={1}
					className={`flex-1 ${isInvalid ? 'opacity-60' : ''}`}
				>
					<span className="font-medium">{menuItem.title}</span>
					{optionLabel && (
						<span className="text-gray-500 text-sm">{optionLabel}</span>
					)}
					<span className="font-medium text-sm">
						{unitPrice.toLocaleString()}원
					</span>
				</VStack>
				<button
					type="button"
					className="ml-2 flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
					onClick={() => onRemove(key)}
					aria-label={`${menuItem.title} 삭제`}
				>
					✕
				</button>
			</HStack>

			{isInvalid && status.kind === 'invalid' && (
				<VStack
					gap={2}
					className="mt-3 rounded-md border border-amber-200 bg-amber-100/60 p-3"
				>
					<span className="font-semibold text-amber-800 text-sm">
						옵션 설정이 변경되어 다시 선택이 필요해요
					</span>
					<ul className="list-disc pl-5 text-amber-700 text-xs">
						{status.reasons.map((reason) => (
							<li key={reason}>{reason}</li>
						))}
					</ul>
					<button
						type="button"
						className="self-start rounded-md border border-gray-200 bg-white px-3 py-1 font-medium text-gray-700 text-xs hover:bg-gray-50"
						onClick={() => onRemove(key)}
					>
						삭제
					</button>
				</VStack>
			)}

			{!isInvalid && (
				<HStack
					justify="between"
					className="mt-3"
				>
					<NumericInput
						value={cartItem.quantity}
						onChange={(quantity) => onUpdateQuantity(key, quantity)}
					/>
					<span className="font-bold">{totalPrice.toLocaleString()}원</span>
				</HStack>
			)}
		</div>
	);
}
