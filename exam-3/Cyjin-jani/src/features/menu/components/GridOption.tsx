import { cn } from '@/shared/lib/utils';
import type { GridOption as GridOptionData } from '@/features/menu/types';

const GRID_COLS_CLASS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

interface GridOptionProps {
  option: GridOptionData;
  value: string | null;
  onChange: (label: string) => void;
}

export function GridOption({ option, value, onChange }: GridOptionProps) {
  const gridCols = GRID_COLS_CLASS[option.col] ?? 'grid-cols-2';
  const groupName = `menu-grid-option-${option.id}`;

  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="mb-2 px-0 text-sm font-semibold">
        {option.name}
        {option.required ? (
          <span className="ml-1 text-destructive">*</span>
        ) : null}
      </legend>
      <div className={cn('grid gap-2', gridCols)}>
        {option.labels.map((label, index) => {
          const icon = option.icons[index] ?? '';
          const price = option.prices[index] ?? 0;
          const selected = value === label;

          return (
            <label
              key={label}
              className={cn(
                'flex cursor-pointer flex-col items-center gap-1 rounded-xl border p-3 text-center transition-colors outline-none focus-within:outline-none',
                selected
                  ? 'border-primary bg-primary/5 text-foreground'
                  : 'border-border bg-card hover:bg-muted/50',
              )}
            >
              <input
                type="radio"
                name={groupName}
                value={label}
                checked={selected}
                onChange={() => onChange(label)}
                className="sr-only outline-none focus:outline-none"
              />
              {icon && <span className="text-2xl leading-none">{icon}</span>}
              <span className="text-sm font-medium">{label}</span>
              {price > 0 && (
                <span className="text-xs text-muted-foreground">
                  +{price.toLocaleString()}원
                </span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
