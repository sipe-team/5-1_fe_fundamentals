import type { FallbackProps } from 'react-error-boundary';

interface ErrorFallbackProps extends FallbackProps {
  title: string;
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
  title,
}: ErrorFallbackProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-4" role="alert">
      <p className="text-sm font-medium text-red-700">{title}</p>
      {error instanceof Error ? (
        <p className="mt-1 text-xs text-red-600">{error.message}</p>
      ) : null}
      <button
        type="button"
        onClick={() => resetErrorBoundary()}
        className="mt-3 rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-500"
      >
        다시 시도
      </button>
    </div>
  );
}
