interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}

export function QuantitySelector({
  value,
  min = 1,
  max = 99,
  disabled = false,
  onChange,
}: QuantitySelectorProps) {
  const currentValue = clamp(value, min, max);
  const canDecrease = !disabled && currentValue > min;
  const canIncrease = !disabled && currentValue < max;

  const handleDecrease = () => {
    if (disabled) return;
    onChange(clamp(currentValue - 1, min, max));
  };

  const handleIncrease = () => {
    if (disabled) return;
    onChange(clamp(currentValue + 1, min, max));
  };

  return (
    <fieldset
      className="flex items-center gap-2 border-none p-0"
      aria-label="수량 선택"
    >
      <button
        type="button"
        onClick={handleDecrease}
        disabled={!canDecrease}
        aria-label="수량 감소"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
      >
        -
      </button>
      <span
        className="min-w-8 text-center text-sm font-medium"
        aria-live="polite"
      >
        {currentValue}
      </span>
      <button
        type="button"
        onClick={handleIncrease}
        disabled={!canIncrease}
        aria-label="수량 증가"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
      >
        +
      </button>
    </fieldset>
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
