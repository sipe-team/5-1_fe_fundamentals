import { TriangleAlert } from 'lucide-react';

interface ErrorFallbackProps {
  onReset: () => void;
}

export default function ErrorFallback({ onReset }: ErrorFallbackProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-24"
      role="alert"
    >
      <TriangleAlert className="h-10 w-10 text-slate-300" />
      <p className="text-sm text-slate-500">
        데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.
      </p>
      <button
        type="button"
        className="text-sm px-5 py-2 rounded-md bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
        onClick={onReset}
      >
        다시 시도
      </button>
    </div>
  );
}
