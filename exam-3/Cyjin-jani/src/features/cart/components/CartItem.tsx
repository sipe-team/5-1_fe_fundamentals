import { CupSodaIcon, XIcon } from 'lucide-react';

import { buildCartItemKey } from '@/features/cart/lib/buildCartItemKey';
import { useRemoveCartItem, useUpdateCartItemQuantity } from '@/features/cart/store/useCartStore';
import { QuantityControl } from '@/shared/components/QuantityControl';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import type { CartItem as CartItemEntity } from '@/features/cart/types';
import { MIN_CART_ITEM_QUANTITY, MAX_CART_ITEM_QUANTITY } from '../lib/cartItemQuantity';

interface CartItemProps {
  item: CartItemEntity;
  optionNameById: Map<number, string>;
}

export function CartItem({ item, optionNameById }: CartItemProps) {
  const updateQuantity = useUpdateCartItemQuantity();
  const removeItem = useRemoveCartItem();
  const cartItemKey = buildCartItemKey(item.itemId, item.options);
  const lineTotal = item.unitPrice * item.quantity;

  return (
    <article
      className={cn(
        'overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm',
        'ring-1 ring-black/3 dark:ring-white/6',
      )}
    >
      <div className="flex gap-3 p-3.5 sm:gap-4 sm:p-4">
        <div className="relative size-18 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-24">
          {item.iconImg ? (
            <img src={item.iconImg} alt="" className="size-full object-cover" loading="lazy" />
          ) : (
            <div className="flex size-full items-center justify-center" aria-hidden>
              <CupSodaIcon
                className="size-9 text-muted-foreground/55 sm:size-10"
                strokeWidth={1.5}
              />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-[15px] font-semibold leading-snug tracking-tight sm:text-base">
              {item.title}
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="-mr-1 -mt-0.5 shrink-0 text-muted-foreground hover:text-foreground"
              aria-label={`${item.title} 삭제`}
              onClick={() => removeItem(cartItemKey)}
            >
              <XIcon className="size-4" />
            </Button>
          </div>

          {item.options.length > 0 && (
            <ul
              className="flex flex-col gap-1.5 rounded-xl bg-muted/60 px-3 py-2.5 text-[13px] leading-relaxed dark:bg-muted/40"
              aria-label="선택한 옵션"
            >
              {item.options.map((sel) => (
                <li key={sel.optionId} className="flex gap-1.5">
                  <span className="shrink-0 font-medium text-foreground/85">
                    {optionNameById.get(sel.optionId) ?? '옵션'}
                  </span>
                  <span className="text-muted-foreground">
                    <span className="text-foreground/35" aria-hidden>
                      ·
                    </span>{' '}
                    {sel.labels.join(', ')}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-col gap-3 border-t border-border/70 pt-3 sm:flex-row sm:items-end sm:justify-between">
            <QuantityControl
              value={item.quantity}
              onChange={(next) => updateQuantity(cartItemKey, next)}
              min={MIN_CART_ITEM_QUANTITY}
              max={MAX_CART_ITEM_QUANTITY}
            />

            <div className="flex flex-col items-end gap-1 sm:text-right">
              <p className="text-xs text-muted-foreground">
                단가 {item.unitPrice.toLocaleString()}원
              </p>
              <p>
                <span className="mr-1.5 text-xs font-medium text-muted-foreground">소계</span>
                <span className="text-lg font-bold tabular-nums tracking-tight text-foreground">
                  {lineTotal.toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-foreground">원</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
