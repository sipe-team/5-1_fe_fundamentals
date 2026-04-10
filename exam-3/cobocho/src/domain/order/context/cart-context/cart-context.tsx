import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from 'react';
import type { MenuItem } from '@/domain/catalog/api';
import type { OptionSelection } from '../../api';
import {
	addItemToCart,
	calcTotalPrice,
	calcTotalQuantity,
} from './cart-context.lib';

export interface CartItem {
	item: MenuItem;
	options: OptionSelection[];
	quantity: number;
	unitPrice: number;
	totalPrice: number;
}

interface CartContextValue {
	items: CartItem[];
	addItem: (
		item: MenuItem,
		options: OptionSelection[],
		quantity: number,
	) => void;
	removeItem: (itemId: string) => void;
	clear: () => void;
	totalPrice: number;
	totalQuantity: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
	const [items, setItems] = useState<CartItem[]>([]);

	const addItem = useCallback(
		(item: MenuItem, options: OptionSelection[], quantity: number) => {
			const newItems = addItemToCart({
				prev: items,
				item,
				options,
				quantity,
				unitPrice: item.price,
			});

			setItems(newItems);
		},
		[items],
	);

	const removeItem = useCallback((itemId: string) => {
		setItems((prev) => prev.filter((ci) => ci.item.id !== itemId));
	}, []);

	const clear = useCallback(() => {
		setItems([]);
	}, []);

	const totalPrice = useMemo(() => calcTotalPrice(items), [items]);
	const totalQuantity = useMemo(() => calcTotalQuantity(items), [items]);

	return (
		<CartContext.Provider
			value={{ items, addItem, removeItem, clear, totalPrice, totalQuantity }}
		>
			{children}
		</CartContext.Provider>
	);
}

export function useCartContext() {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error('useCartContext must be used within CartProvider');
	}
	return context;
}
