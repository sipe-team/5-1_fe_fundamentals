import { MinusIcon, PlusIcon } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

function clampQuantity(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

interface QuantityControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantityControl({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}: QuantityControlProps) {
  const [inputText, setInputText] = useState(String(value));

  useEffect(() => {
    setInputText(String(value));
  }, [value]);

  const decrementDisabled = value <= min;
  const incrementDisabled = value >= max;

  function applyInputTextOnBlur() {
    const parsed = Number.parseInt(inputText, 10);
    const nextQuantity = Number.isNaN(parsed) ? min : clampQuantity(parsed, min, max);
    setInputText(String(nextQuantity));
    onChange(nextQuantity);
  }

  function handleQuantityInputChange(e: ChangeEvent<HTMLInputElement>) {
    setInputText(e.target.value);
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label="수량 감소"
        disabled={decrementDisabled}
        onClick={() => onChange(clampQuantity(value - 1, min, max))}
      >
        <MinusIcon />
      </Button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={inputText}
        onChange={handleQuantityInputChange}
        onBlur={applyInputTextOnBlur}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            applyInputTextOnBlur();
          }
        }}
        className={cn(
          'h-9 w-14 rounded-lg border border-border bg-background text-center text-sm font-medium',
          '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
        )}
        aria-label="수량"
      />
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label="수량 증가"
        disabled={incrementDisabled}
        onClick={() => onChange(clampQuantity(value + 1, min, max))}
      >
        <PlusIcon />
      </Button>
    </div>
  );
}
