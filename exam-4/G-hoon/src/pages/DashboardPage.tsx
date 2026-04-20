import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ChipAccordionPanel } from '@/components/accordion/ChipAccordionPanel';
import { ErrorFallback } from '@/components/common/ErrorFallback';
import { MemberList } from '@/components/sidebar/MemberList';
import { LevelSelector } from '@/components/toolbar/LevelSelector';
import { useDashboardSearchParams } from '@/hooks/useDashboardSearchParams';

export function DashboardPage() {
  const { selectedMemberId, selectedLevelKey, selectMember, changeLevel } =
    useDashboardSearchParams();

  return (
    <div className="flex h-screen">
      <aside className="w-48 shrink-0 border-r border-gray-200 bg-white flex flex-col">
        <h2 className="px-4 py-3 text-sm font-bold text-gray-500 border-b border-gray-100">
          스터디원
        </h2>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
              <Suspense
                fallback={
                  <div className="p-4 text-sm text-gray-400">로딩 중...</div>
                }
              >
                <MemberList
                  selectedMemberId={selectedMemberId}
                  onSelectMember={selectMember}
                />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        <header className="shrink-0 border-b border-gray-200 px-6 py-4 flex items-center gap-6">
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
                <Suspense
                  fallback={
                    <div className="text-sm text-gray-400">로딩 중...</div>
                  }
                >
                  <LevelSelector
                    selectedLevelKey={selectedLevelKey}
                    onChangeLevel={changeLevel}
                  />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {selectedMemberId ? (
            <QueryErrorResetBoundary>
              {({ reset }) => (
                <ErrorBoundary
                  onReset={reset}
                  FallbackComponent={ErrorFallback}
                >
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center py-16 text-sm text-gray-400">
                        문제 유형을 불러오는 중...
                      </div>
                    }
                  >
                    <ChipAccordionPanel
                      key={`${selectedMemberId}-${selectedLevelKey}`}
                      memberId={selectedMemberId}
                      levelKey={selectedLevelKey}
                    />
                  </Suspense>
                </ErrorBoundary>
              )}
            </QueryErrorResetBoundary>
          ) : (
            <div className="flex items-center justify-center py-16 text-sm text-gray-400">
              스터디원을 선택해주세요.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
