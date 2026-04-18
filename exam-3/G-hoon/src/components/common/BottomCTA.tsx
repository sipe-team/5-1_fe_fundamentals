interface BottomCTAProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function BottomCTA({
  label,
  onClick,
  disabled = false,
}: BottomCTAProps) {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-20 mx-auto border-t border-gray-100 bg-white px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)]">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="w-full rounded-lg bg-blue-600 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {label}
      </button>
    </footer>
  );
}

export function BottomCTASpacer() {
  return <div aria-hidden="true" className="h-24" />;
}
