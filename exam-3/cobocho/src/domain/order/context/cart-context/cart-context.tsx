import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { usePersistentStorage } from '@/shared/hooks/use-persistent-storage';
import type { OptionSelection } from '../../api';
import {
  addItemToCart,
  calcTotalQuantity,
  cartItemKey,
} from './cart-context.lib';

const CART_STORAGE_KEY = 'cart';
const CART_STORAGE_VERSION = 1;

export interface CartItem {
  itemId: string;
  options: OptionSelection[];
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (
    itemId: string,
    options: OptionSelection[],
    quantity: number,
  ) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  totalQuantity: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = usePersistentStorage<CartItem[]>({
    key: CART_STORAGE_KEY,
    version: CART_STORAGE_VERSION,
    initialValue: [],
  });

  const addItem = useCallback(
    (itemId: string, options: OptionSelection[], quantity: number) => {
      setItems((prev) => addItemToCart({ prev, itemId, options, quantity }));
    },
    [setItems],
  );

  const removeItem = useCallback(
    (key: string) => {
      setItems((prev) =>
        prev.filter((ci) => cartItemKey(ci.itemId, ci.options) !== key),
      );
    },
    [setItems],
  );

  const updateQuantity = useCallback(
    (key: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(key);
        return;
      }

      setItems((prev) =>
        prev.map((ci) =>
          cartItemKey(ci.itemId, ci.options) === key ? { ...ci, quantity } : ci,
        ),
      );
    },
    [removeItem, setItems],
  );

  const clear = useCallback(() => {
    setItems([]);
  }, [setItems]);

  const totalQuantity = useMemo(() => calcTotalQuantity(items), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clear,
        totalQuantity,
      }}
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
