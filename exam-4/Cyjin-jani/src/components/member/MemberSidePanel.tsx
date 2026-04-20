import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/components/common/fallbacks/ErrorFallback';
import { LoadingFallback } from '@/components/common/fallbacks/LoadingFallback';
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
            <ErrorBoundary
              onReset={reset}
              fallbackRender={(props) => (
                <ErrorFallback {...props} title="스터디원 목록을 불러오지 못했습니다." />
              )}
            >
              <Suspense fallback={<LoadingFallback message="스터디원 목록을 불러오는 중…" />}>
                <MemberList selectedId={selectedMemberId} onSelect={setSelectedMemberId} />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </section>
    </aside>
  );
}
