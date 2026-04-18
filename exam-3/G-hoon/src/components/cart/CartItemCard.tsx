import { X } from 'lucide-react';
import { QuantitySelector } from '@/components/common/QuantitySelector';
import { formatPrice } from '@/lib/formatters';
import type { CartItem } from '@/types/order';

interface CartItemCardProps {
  item: CartItem;
  disabled?: boolean;
  onChangeQuantity: (quantity: number) => void;
  onRemove: () => void;
}

function getOptionSummaryText(item: CartItem): string {
  return item.options
    .map((opt) => {
      const labels = opt.labels.join(', ');
      return opt.name ? `${opt.name}: ${labels}` : labels;
    })
    .filter(Boolean)
    .join(' / ');
}

export function CartItemCard({
  item,
  disabled = false,
  onChangeQuantity,
  onRemove,
}: CartItemCardProps) {
  const optionText = getOptionSummaryText(item);

  return (
    <li className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
          {optionText && (
            <p className="mt-1 truncate text-xs text-gray-500">{optionText}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          aria-label={`${item.title} 삭제`}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <X size={16} />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <QuantitySelector
          value={item.quantity}
          onChange={onChangeQuantity}
          disabled={disabled}
        />
        <p className="text-sm font-bold text-gray-900">
          {formatPrice(item.unitPrice * item.quantity)}원
        </p>
      </div>
    </li>
  );
}
