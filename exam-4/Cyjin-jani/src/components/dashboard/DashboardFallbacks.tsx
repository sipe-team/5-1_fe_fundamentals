import type { FallbackProps } from 'react-error-boundary';

export function DashboardLevelSelectorLoadingFallback() {
  return (
    <div
      className="rounded-lg border border-neutral-200 bg-white px-4 py-6 text-sm text-neutral-500"
      aria-busy="true"
      aria-live="polite"
    >
      학습 단계를 불러오는 중...
    </div>
  );
}

export function DashboardChipBoardLoadingFallback() {
  return (
    <div
      className="rounded-lg border border-neutral-200 bg-white px-4 py-6 text-sm text-neutral-500"
      aria-busy="true"
      aria-live="polite"
    >
      칩 보드를 불러오는 중...
    </div>
  );
}

export function DashboardLevelSelectorErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <div
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-4"
      role="alert"
    >
      <p className="text-sm font-medium text-red-700">
        학습 단계를 불러오지 못했습니다.
      </p>
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

export function DashboardChipBoardErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <div
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-4"
      role="alert"
    >
      <p className="text-sm font-medium text-red-700">
        칩 보드 데이터를 불러오지 못했습니다.
      </p>
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
