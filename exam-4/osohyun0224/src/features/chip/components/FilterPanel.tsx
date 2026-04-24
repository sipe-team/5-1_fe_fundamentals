import { type CSSProperties, memo } from 'react';
import type { FilterState, ProficiencyLevel } from '@/types';
import { hasActiveFilters } from '../utils/filterUtils';

const PROFICIENCY_LEVELS: { key: ProficiencyLevel; label: string }[] = [
  { key: 'UNSEEN', label: '미도전' },
  { key: 'FAILED', label: '오답' },
  { key: 'PARTIAL', label: '부분 통과' },
  { key: 'PASSED', label: '통과' },
  { key: 'MASTERED', label: '완전 정복' },
];

interface FilterPanelProps {
  filters: FilterState;
  proficiencyCounts: Record<ProficiencyLevel, number>;
  onToggleFrequent: () => void;
  onToggleProficiency: (proficiency: ProficiencyLevel) => void;
  onReset: () => void;
}

export const FilterPanel = memo(function FilterPanel({
  filters,
  proficiencyCounts,
  onToggleFrequent,
  onToggleProficiency,
  onReset,
}: FilterPanelProps) {
  const hasActiveFilter = hasActiveFilters(filters);

  return (
    <div style={containerStyle}>
      <div style={rowStyle}>
        <label style={toggleLabelStyle}>
          <input
            type="checkbox"
            checked={filters.onlyFrequent}
            onChange={onToggleFrequent}
            style={checkboxStyle}
          />
          빈출 유형만 보기
        </label>
      </div>

      <div style={rowStyle}>
        <span style={sectionLabelStyle}>숙련도</span>
        <div style={proficiencyListStyle}>
          {PROFICIENCY_LEVELS.map(({ key, label }) => (
            <label key={key} style={proficiencyItemStyle}>
              <input
                type="checkbox"
                checked={filters.selectedProficiencies.includes(key)}
                onChange={() => onToggleProficiency(key)}
                style={checkboxStyle}
              />
              <span>{label}</span>
              <span style={countBadgeStyle}>{proficiencyCounts[key]}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        disabled={!hasActiveFilter}
        style={{
          ...resetButtonStyle,
          opacity: hasActiveFilter ? 1 : 0.4,
          cursor: hasActiveFilter ? 'pointer' : 'default',
        }}
      >
        필터 초기화
      </button>
    </div>
  );
});

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  padding: '12px 0',
};

const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
};

const toggleLabelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 14,
  color: '#374151',
  cursor: 'pointer',
  fontWeight: 500,
};

const sectionLabelStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: '#374151',
  whiteSpace: 'nowrap',
  paddingTop: 2,
};

const proficiencyListStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
};

const proficiencyItemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  fontSize: 13,
  color: '#4b5563',
  cursor: 'pointer',
};

const checkboxStyle: CSSProperties = {
  cursor: 'pointer',
};

const countBadgeStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: '#6b7280',
  backgroundColor: '#f3f4f6',
  borderRadius: 10,
  padding: '1px 6px',
  minWidth: 20,
  textAlign: 'center',
};

const resetButtonStyle: CSSProperties = {
  alignSelf: 'flex-start',
  padding: '6px 14px',
  border: '1px solid #d1d5db',
  borderRadius: 8,
  backgroundColor: '#ffffff',
  color: '#374151',
  fontSize: 13,
  fontWeight: 500,
};
