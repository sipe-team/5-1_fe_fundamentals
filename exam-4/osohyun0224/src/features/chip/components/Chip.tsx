import { type CSSProperties, memo } from 'react';
import type { ChipWithProficiency } from '@/types';

const PROFICIENCY_COLORS: Record<
  string,
  { background: string; border: string; text: string }
> = {
  UNSEEN: { background: '#f9fafb', border: '#e5e7eb', text: '#6b7280' },
  FAILED: { background: '#fef2f2', border: '#fecaca', text: '#dc2626' },
  PARTIAL: { background: '#fffbeb', border: '#fde68a', text: '#d97706' },
  PASSED: { background: '#f0fdf4', border: '#bbf7d0', text: '#16a34a' },
  MASTERED: { background: '#eff6ff', border: '#bfdbfe', text: '#2563eb' },
};

interface ChipProps {
  chip: ChipWithProficiency;
  isSelected: boolean;
  onToggle: (chipId: number) => void;
}

export const Chip = memo(function Chip({
  chip,
  isSelected,
  onToggle,
}: ChipProps) {
  const colors = PROFICIENCY_COLORS[chip.proficiency];

  return (
    <button
      type="button"
      onClick={() => onToggle(chip.chipId)}
      style={{
        ...chipStyle,
        backgroundColor: isSelected ? colors.border : colors.background,
        borderColor: isSelected ? colors.text : colors.border,
        color: colors.text,
        fontWeight: isSelected ? 600 : 400,
        boxShadow: isSelected ? `0 0 0 1px ${colors.text}` : 'none',
      }}
      title={`${chip.problemTypeName} (${chip.proficiency})`}
    >
      {chip.frequent && <span style={frequentBadgeStyle}>★</span>}
      <span style={chipTextStyle}>{chip.problemTypeName}</span>
      {isSelected && <span style={checkStyle}>✓</span>}
    </button>
  );
});

const chipStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '4px 10px',
  borderRadius: 16,
  border: '1.5px solid',
  fontSize: 13,
  cursor: 'pointer',
  transition: 'all 0.15s',
  whiteSpace: 'nowrap',
  lineHeight: 1.4,
};

const frequentBadgeStyle: CSSProperties = {
  fontSize: 11,
  color: '#f59e0b',
};

const chipTextStyle: CSSProperties = {
  maxWidth: 120,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const checkStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
};
