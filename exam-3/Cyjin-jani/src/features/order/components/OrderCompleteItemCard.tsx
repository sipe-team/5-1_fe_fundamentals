import type { OrderItem } from '@/types/order';

interface OrderCompleteItemCardProps {
  item: OrderItem;
  optionNameById: Map<number, string>;
}

export function OrderCompleteItemCard({ item, optionNameById }: OrderCompleteItemCardProps) {
  return (
    <li className="rounded-2xl border border-border/80 bg-card p-4 text-sm ring-1 ring-black/3 dark:ring-white/6">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold leading-snug">{item.title}</p>
          <p className="mt-1 break-all text-xs text-muted-foreground">상품 ID: {item.itemId}</p>
        </div>
        <span className="shrink-0 text-muted-foreground">{item.quantity}개</span>
      </div>
      {item.options.length > 0 && (
        <ul
          className="mt-2 flex flex-col gap-1 rounded-xl bg-muted/60 px-3 py-2 text-[13px] dark:bg-muted/40"
          aria-label="선택 옵션"
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
      <div className="mt-3 flex flex-col gap-1 border-t border-border pt-3 text-muted-foreground">
        <div className="flex justify-between">
          <span>기본가</span>
          <span>{item.basePrice.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between">
          <span>옵션 포함가</span>
          <span>{item.unitPrice.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between font-semibold text-foreground">
          <span>소계</span>
          <span>{(item.unitPrice * item.quantity).toLocaleString()}원</span>
        </div>
      </div>
    </li>
  );
}
