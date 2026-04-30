import { getFriendlyErrorMessage } from '@/api/client';

interface ErrorFallbackProps {
  error: unknown;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 py-12 text-center">
      <p className="text-sm text-gray-500">{getFriendlyErrorMessage(error)}</p>
      <button
        type="button"
        onClick={resetErrorBoundary}
        className="rounded-md border border-gray-300 px-4 py-1.5 text-sm hover:bg-gray-50"
      >
        다시 시도
      </button>
    </div>
  );
}
