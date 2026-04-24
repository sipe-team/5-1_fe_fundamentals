import { type CSSProperties, memo, useCallback } from 'react';
import type { FieldSection } from '@/types';
import {
  type CheckState,
  collectAllChips,
  getCheckState,
} from '../utils/checkState';
import { TopicRow } from './TopicRow';

interface ChipAccordionProps {
  fields: FieldSection[];
  expandedFieldIds: Set<number>;
  selectedChipIds: Set<number>;
  onToggleField: (fieldId: number) => void;
  onToggleChip: (chipId: number) => void;
  onToggleFieldChips: (fieldId: number) => void;
  onToggleTopicChips: (topicId: number) => void;
}

function getFieldCheckState(
  field: FieldSection,
  selectedChipIds: Set<number>,
): { state: CheckState; selected: number; total: number } {
  const allChips = collectAllChips(field.topics);
  const total = allChips.length;
  const selected = allChips.filter((chip) =>
    selectedChipIds.has(chip.chipId),
  ).length;
  return { state: getCheckState(selected, total), selected, total };
}

export const ChipAccordion = memo(function ChipAccordion({
  fields,
  expandedFieldIds,
  selectedChipIds,
  onToggleField,
  onToggleChip,
  onToggleFieldChips,
  onToggleTopicChips,
}: ChipAccordionProps) {
  return (
    <div style={containerStyle}>
      {fields.map((field) => {
        const isExpanded = expandedFieldIds.has(field.fieldId);
        const {
          state: fieldCheck,
          selected,
          total,
        } = getFieldCheckState(field, selectedChipIds);

        return (
          <div key={field.fieldId} style={sectionStyle}>
            <div style={headerRowStyle}>
              <IndeterminateCheckbox
                id={field.fieldId}
                checkState={fieldCheck}
                onToggle={onToggleFieldChips}
                ariaLabel="분야 전체 선택"
              />
              <button
                type="button"
                onClick={() => onToggleField(field.fieldId)}
                style={headerStyle}
                aria-expanded={isExpanded}
              >
                <span style={arrowStyle}>{isExpanded ? '▼' : '▶'}</span>
                <span style={fieldNameStyle}>{field.fieldName}</span>
                <span style={countStyle}>
                  {selected}/{total}
                </span>
              </button>
            </div>

            {isExpanded && (
              <div style={contentStyle}>
                {field.topics.map((topic) => (
                  <TopicRow
                    key={topic.topicId}
                    topic={topic}
                    selectedChipIds={selectedChipIds}
                    onToggleChip={onToggleChip}
                    onToggleTopicChips={onToggleTopicChips}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});

const IndeterminateCheckbox = memo(function IndeterminateCheckbox({
  id,
  checkState,
  onToggle,
  ariaLabel,
}: {
  id: number;
  checkState: CheckState;
  onToggle: (id: number) => void;
  ariaLabel: string;
}) {
  const ref = useCallback(
    (el: HTMLInputElement | null) => {
      if (el) el.indeterminate = checkState === 'indeterminate';
    },
    [checkState],
  );

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checkState === 'checked'}
      onChange={() => onToggle(id)}
      style={checkboxStyle}
      aria-label={ariaLabel}
    />
  );
});

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const sectionStyle: CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: 10,
  overflow: 'hidden',
  backgroundColor: '#ffffff',
};

const headerRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '0 0 0 12px',
  background: '#f9fafb',
};

const headerStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '12px 16px 12px 0',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  fontSize: 15,
  textAlign: 'left',
};

const arrowStyle: CSSProperties = {
  fontSize: 11,
  color: '#6b7280',
  width: 16,
  textAlign: 'center',
};

const fieldNameStyle: CSSProperties = {
  fontWeight: 700,
  color: '#111827',
  flex: 1,
};

const countStyle: CSSProperties = {
  fontSize: 12,
  color: '#9ca3af',
  fontWeight: 500,
};

const contentStyle: CSSProperties = {
  padding: '4px 16px 8px',
};

const checkboxStyle: CSSProperties = {
  cursor: 'pointer',
  width: 16,
  height: 16,
};
