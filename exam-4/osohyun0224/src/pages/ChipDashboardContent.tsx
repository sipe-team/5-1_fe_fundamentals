import type { CSSProperties } from 'react';
import { ChipAccordion } from '@/features/chip/components/ChipAccordion';
import { ChipCounter } from '@/features/chip/components/ChipCounter';
import { FilterPanel } from '@/features/chip/components/FilterPanel';
import { LevelSelect } from '@/features/chip/components/LevelSelect';
import { useChipDashboard } from '@/features/chip/hooks/useChipDashboard';
import { hasActiveFilters } from '@/features/chip/utils/filterUtils';
import { MemberList } from '@/features/member/components/MemberList';
import { EmptyState } from '@/shared/components/EmptyState';

export function ChipDashboardContent() {
  const {
    members,
    levels,
    selectedMemberId,
    selectedLevelKey,
    filters,
    selectedChipIds,
    expandedFieldIds,
    filteredTree,
    proficiencyCounts,
    selectedVisibleCount,
    selectMember,
    selectLevel,
    toggleFrequent,
    toggleProficiency,
    resetFilters,
    toggleChip,
    toggleField,
    toggleFieldChips,
    toggleTopicChips,
  } = useChipDashboard();

  return (
    <div style={layoutStyle}>
      <MemberList
        members={members}
        selectedMemberId={selectedMemberId}
        onSelectMember={selectMember}
      />

      <main style={mainStyle}>
        <div style={topBarStyle}>
          <LevelSelect
            levels={levels}
            selectedLevelKey={selectedLevelKey}
            onSelectLevel={selectLevel}
          />
          <FilterPanel
            filters={filters}
            proficiencyCounts={proficiencyCounts}
            onToggleFrequent={toggleFrequent}
            onToggleProficiency={toggleProficiency}
            onReset={resetFilters}
          />
        </div>

        <div style={contentStyle}>
          {filteredTree.length === 0 ? (
            <EmptyState
              message={
                hasActiveFilters(filters)
                  ? '필터 조건에 맞는 문제 유형이 없습니다.'
                  : '해당 학습 단계에 문제 유형이 없습니다.'
              }
            />
          ) : (
            <ChipAccordion
              fields={filteredTree}
              expandedFieldIds={expandedFieldIds}
              selectedChipIds={selectedChipIds}
              onToggleField={toggleField}
              onToggleChip={toggleChip}
              onToggleFieldChips={toggleFieldChips}
              onToggleTopicChips={toggleTopicChips}
            />
          )}
        </div>

        <ChipCounter count={selectedVisibleCount} />
      </main>
    </div>
  );
}

const layoutStyle: CSSProperties = {
  display: 'flex',
  height: '100vh',
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const mainStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const topBarStyle: CSSProperties = {
  padding: '16px 24px',
  borderBottom: '1px solid #e5e7eb',
};

const contentStyle: CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: '16px 24px',
};
