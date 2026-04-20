import type { CSSProperties } from 'react';

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div style={containerStyle}>
      <p style={textStyle}>{message}</p>
    </div>
  );
}

const containerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '64px 24px',
};

const textStyle: CSSProperties = {
  color: '#9ca3af',
  fontSize: 14,
  margin: 0,
};
