import { type CSSProperties, memo } from 'react';
import type { Level } from '@/types';

interface LevelSelectProps {
  levels: Level[];
  selectedLevelKey: string;
  onSelectLevel: (levelKey: string) => void;
}

export const LevelSelect = memo(function LevelSelect({
  levels,
  selectedLevelKey,
  onSelectLevel,
}: LevelSelectProps) {
  return (
    <div style={containerStyle}>
      <label htmlFor="level-select" style={labelStyle}>
        학습 단계
      </label>
      <select
        id="level-select"
        value={selectedLevelKey}
        onChange={(event) => onSelectLevel(event.target.value)}
        style={selectStyle}
      >
        {levels.map((level) => (
          <option key={level.key} value={level.key}>
            {level.name}
          </option>
        ))}
      </select>
    </div>
  );
});

const containerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const labelStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: '#374151',
  whiteSpace: 'nowrap',
};

const selectStyle: CSSProperties = {
  padding: '6px 12px',
  borderRadius: 8,
  border: '1px solid #d1d5db',
  fontSize: 14,
  color: '#111827',
  backgroundColor: '#ffffff',
  cursor: 'pointer',
  outline: 'none',
};
