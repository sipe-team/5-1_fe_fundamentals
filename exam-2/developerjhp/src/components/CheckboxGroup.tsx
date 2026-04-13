import { css } from "@emotion/react";
import { spacing } from "@/styles/tokens";

interface CheckboxGroupOption<T extends string> {
  value: T;
  label: string;
}

interface CheckboxGroupProps<T extends string> {
  options: readonly CheckboxGroupOption<T>[];
  selected: readonly T[];
  onChange: (next: T[]) => void;
}

export function CheckboxGroup<T extends string>({
  options,
  selected,
  onChange,
}: CheckboxGroupProps<T>) {
  const toggle = (value: T) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        gap: ${spacing.sm};
      `}
    >
      {options.map((option) => (
        <label
          key={option.value}
          css={css`
            display: flex;
            align-items: center;
            gap: 2px;
          `}
        >
          <input
            type="checkbox"
            checked={selected.includes(option.value)}
            onChange={() => toggle(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}
