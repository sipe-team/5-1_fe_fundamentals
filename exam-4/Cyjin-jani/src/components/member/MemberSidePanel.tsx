import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { MemberList } from '@/components/member/MemberList';
import { useMemberSelection } from '@/contexts/member/MemberSelectionContext';

export function MemberSidePanel() {
  const { selectedMemberId, setSelectedMemberId } = useMemberSelection();

  return (
    <aside className="flex min-h-0 w-72 shrink-0 py-6 pl-6">
      <section className="flex min-h-0 w-full flex-col rounded-lg border border-neutral-200 bg-white">
        <header className="border-b border-neutral-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-neutral-900">스터디원</h2>
        </header>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary onReset={reset} FallbackComponent={MembersSidePanelErrorFallback}>
              <Suspense fallback={<MembersLoadingFallback />}>
                <MemberList selectedId={selectedMemberId} onSelect={setSelectedMemberId} />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </section>
    </aside>
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

function MembersSidePanelErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
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
