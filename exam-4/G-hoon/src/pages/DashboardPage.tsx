import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense, useCallback, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ChipAccordionPanel } from '@/components/accordion/ChipAccordionPanel';
import { ErrorFallback } from '@/components/common/ErrorFallback';
import { MemberList } from '@/components/sidebar/MemberList';
import { LevelSelector } from '@/components/toolbar/LevelSelector';
import type { FilterState } from '@/types';

const DEFAULT_LEVEL_KEY = 'basic';

const INITIAL_FILTER: FilterState = {
  onlyFrequent: false,
  selectedProficiencies: [],
};

export function DashboardPage() {
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [selectedLevelKey, setSelectedLevelKey] = useState(DEFAULT_LEVEL_KEY);
  const [selectedChipIds, setSelectedChipIds] = useState<Set<number>>(
    new Set(),
  );
  const [openedFieldIds, setOpenedFieldIds] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<FilterState>(INITIAL_FILTER);

  const handleSelectMember = useCallback((memberId: number) => {
    setSelectedMemberId(memberId);
    setSelectedLevelKey(DEFAULT_LEVEL_KEY);
    setSelectedChipIds(new Set());
    setOpenedFieldIds(new Set());
    setFilter(INITIAL_FILTER);
  }, []);

  const handleChangeLevel = useCallback((levelKey: string) => {
    setSelectedLevelKey(levelKey);
    setSelectedChipIds(new Set());
  }, []);

  const handleToggleChip = useCallback((chipId: number) => {
    setSelectedChipIds((prev) => {
      const next = new Set(prev);
      if (next.has(chipId)) {
        next.delete(chipId);
      } else {
        next.add(chipId);
      }
      return next;
    });
  }, []);

  const handleToggleField = useCallback((fieldId: number) => {
    setOpenedFieldIds((prev) => {
      const next = new Set(prev);
      if (next.has(fieldId)) {
        next.delete(fieldId);
      } else {
        next.add(fieldId);
      }
      return next;
    });
  }, []);

  const handleRegisterFields = useCallback((fieldIds: number[]) => {
    setOpenedFieldIds((prev) => {
      let changed = false;
      const next = new Set(prev);

      for (const fieldId of fieldIds) {
        if (!next.has(fieldId)) {
          next.add(fieldId);
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, []);

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
                  onSelectMember={handleSelectMember}
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
                    onChangeLevel={handleChangeLevel}
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
                      memberId={selectedMemberId}
                      levelKey={selectedLevelKey}
                      filter={filter}
                      onChangeFilter={setFilter}
                      selectedChipIds={selectedChipIds}
                      onToggleChip={handleToggleChip}
                      openedFieldIds={openedFieldIds}
                      onToggleField={handleToggleField}
                      onRegisterFields={handleRegisterFields}
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
