import { type CSSProperties, memo, useCallback } from 'react';
import type { FieldSection } from '@/types';
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

type CheckState = 'checked' | 'unchecked' | 'indeterminate';

function getFieldCheckState(
  field: FieldSection,
  selectedChipIds: Set<number>,
): { state: CheckState; selected: number; total: number } {
  let total = 0;
  let selected = 0;
  for (const topic of field.topics) {
    for (const chip of [...topic.easy, ...topic.medium, ...topic.hard]) {
      total++;
      if (selectedChipIds.has(chip.chipId)) selected++;
    }
  }
  const state: CheckState =
    selected === 0
      ? 'unchecked'
      : selected === total
        ? 'checked'
        : 'indeterminate';
  return { state, selected, total };
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
              <FieldCheckbox
                fieldId={field.fieldId}
                checkState={fieldCheck}
                onToggle={onToggleFieldChips}
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

const FieldCheckbox = memo(function FieldCheckbox({
  fieldId,
  checkState,
  onToggle,
}: {
  fieldId: number;
  checkState: CheckState;
  onToggle: (fieldId: number) => void;
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
      onChange={() => onToggle(fieldId)}
      style={checkboxStyle}
      aria-label="분야 전체 선택"
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
