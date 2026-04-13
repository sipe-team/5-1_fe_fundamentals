import type { GridOption } from '@/types/order';

interface OptionGridProps {
  option: GridOption;
  selected: string | null;
  onSelect: (label: string) => void;
}

export function OptionGrid({ option, selected, onSelect }: OptionGridProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold text-gray-900">
        {option.name}
        <span className="ml-1 text-xs font-normal text-red-500">필수</span>
      </legend>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${option.col}, 1fr)` }}
      >
        {option.labels.map((label, idx) => {
          const isSelected = selected === label;
          const price = option.prices[idx];
          return (
            <button
              key={label}
              type="button"
              onClick={() => onSelect(label)}
              aria-pressed={isSelected}
              className={`flex flex-col items-center justify-center gap-1 rounded-lg border-2 px-3 py-3 text-sm font-medium transition-colors ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:bg-blue-50/50'
              }`}
            >
              <span className="text-lg">{option.icons[idx]}</span>
              <span>{label}</span>
              {price > 0 && (
                <span className="text-xs text-gray-400">
                  +{price.toLocaleString()}원
                </span>
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
