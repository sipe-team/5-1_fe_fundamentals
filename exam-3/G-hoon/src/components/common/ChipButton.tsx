import type { ReactNode } from 'react';

interface ChipButtonProps {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

export function ChipButton({
  children,
  selected = false,
  onClick,
}: ChipButtonProps) {
  const className = `whitespace-nowrap rounded-lg border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
    selected
      ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
  }`;

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}
