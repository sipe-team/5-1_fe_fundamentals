import { Check } from 'lucide-react';

export function SelectionCheckOverlay() {
  return (
    <span className="absolute inset-0 inline-flex items-center justify-center rounded-full bg-black/50 text-white">
      <Check
        size={16}
        strokeWidth={3}
        className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
        aria-hidden="true"
      />
    </span>
  );
}
