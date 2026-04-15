import type { CartLineItem, MenuOption } from "@/shared/types";

import { CartItemCard } from "@/domains/cart/components";
import { changeCartQuantity, removeFromCart } from "@/domains/cart/utils";

export default function CartItemList({
  cartItems,
  optionsById,
}: {
  cartItems: CartLineItem[];
  optionsById: Map<number, MenuOption>;
}) {
  return (
    <>
      {cartItems.map((item) => (
        <CartItemCard
          key={item.cartKey}
          item={item}
          optionsById={optionsById}
          onDecrease={() => changeCartQuantity(item.cartKey, item.quantity - 1)}
          onIncrease={() => changeCartQuantity(item.cartKey, item.quantity + 1)}
          onRemove={() => removeFromCart(item.cartKey)}
        />
      ))}
    </>
  );
}
