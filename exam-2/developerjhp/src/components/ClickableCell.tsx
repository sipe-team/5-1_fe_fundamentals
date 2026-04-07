import type { KeyboardEvent, ReactNode, TdHTMLAttributes } from "react";

interface ClickableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, "onClick"> {
  onActivate: () => void;
  ariaLabel: string;
  children?: ReactNode;
}

export function ClickableCell({
  onActivate,
  ariaLabel,
  children,
  ...rest
}: ClickableCellProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTableCellElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onActivate();
    }
  };

  return (
    <td
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={onActivate}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </td>
  );
}
