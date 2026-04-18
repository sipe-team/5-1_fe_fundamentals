import { toast } from 'sonner';
import type { ListOption } from '@/types/order';

interface OptionListProps {
  option: ListOption;
  selected: string[];
  onToggle: (label: string) => void;
  errorMessage?: string | null;
}

export function OptionList({
  option,
  selected,
  onToggle,
  errorMessage,
}: OptionListProps) {
  const isRequired = option.minCount > 0;
  const isMaxed = selected.length >= option.maxCount;

  const handleToggle = (label: string) => {
    const isSelected = selected.includes(label);
    if (!isSelected && selected.length >= option.maxCount) {
      toast.error(`최대 ${option.maxCount}개까지 선택할 수 있어요`);
      return;
    }
    onToggle(label);
  };

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold text-gray-900">
        {option.name}
        {isRequired ? (
          <span className="ml-1 text-xs font-normal text-red-500">필수</span>
        ) : (
          <span className="ml-1 text-xs font-normal text-gray-400">선택</span>
        )}
        <span className="ml-1 text-xs font-normal text-gray-400">
          (최대 {option.maxCount}개)
        </span>
      </legend>
      <ul className="divide-y divide-gray-50 rounded-lg border border-gray-200 bg-white">
        {option.labels.map((label, idx) => {
          const price = option.prices[idx];
          const isChecked = selected.includes(label);
          const isDimmed = !isChecked && isMaxed;
          return (
            <li key={label}>
              <label
                className={`flex cursor-pointer items-center justify-between px-4 py-3 transition-colors hover:bg-blue-50/50 ${
                  isDimmed ? 'opacity-50' : ''
                }`}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggle(label)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </span>
                {price > 0 && (
                  <span className="text-xs text-gray-400">
                    +{price.toLocaleString()}원
                  </span>
                )}
              </label>
            </li>
          );
        })}
      </ul>
      {errorMessage && (
        <p className="text-xs text-red-500" aria-live="polite">
          {errorMessage}
        </p>
      )}
    </fieldset>
  );
}
