import { type CSSProperties, memo } from 'react';

interface ChipCounterProps {
  count: number;
}

export const ChipCounter = memo(function ChipCounter({
  count,
}: ChipCounterProps) {
  return (
    <div style={containerStyle}>
      <span style={labelStyle}>선택된 칩</span>
      <span style={countStyle}>{count}</span>
      <span style={unitStyle}>개</span>
    </div>
  );
});

const containerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '12px 16px',
  borderTop: '1px solid #e5e7eb',
  backgroundColor: '#f9fafb',
};

const labelStyle: CSSProperties = {
  fontSize: 14,
  color: '#6b7280',
};

const countStyle: CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  color: '#2563eb',
};

const unitStyle: CSSProperties = {
  fontSize: 14,
  color: '#6b7280',
};
