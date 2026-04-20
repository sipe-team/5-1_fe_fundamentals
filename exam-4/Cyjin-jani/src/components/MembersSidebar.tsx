import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { MemberPanel } from '@/components/MemberPanel';

export function MembersSidebar() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={MembersSidebarErrorFallback}>
          <Suspense fallback={<MembersLoadingFallback />}>
            <MemberPanel />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function MembersLoadingFallback() {
  return (
    <div
      className="px-3 py-6 text-center text-sm text-neutral-500"
      aria-busy="true"
      aria-live="polite"
    >
      스터디원 목록을 불러오는 중…
    </div>
  );
}

function MembersSidebarErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="px-3 py-4" role="alert">
      <p className="text-sm text-red-700">스터디원 목록을 불러오지 못했습니다.</p>
      {error instanceof Error ? (
        <p className="mt-1 text-xs text-neutral-500">{error.message}</p>
      ) : null}
      <button
        type="button"
        onClick={() => resetErrorBoundary()}
        className="mt-3 rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-800"
      >
        다시 시도
      </button>
    </div>
  );
}
