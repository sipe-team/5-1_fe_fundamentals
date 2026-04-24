import type { CSSProperties } from 'react';

export function LoadingSpinner() {
  return (
    <div style={containerStyle}>
      <div style={spinnerStyle} />
      <p style={textStyle}>데이터를 불러오는 중...</p>
    </div>
  );
}

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '48px 0',
  gap: 16,
};

const spinnerStyle: CSSProperties = {
  width: 32,
  height: 32,
  border: '3px solid #e5e7eb',
  borderTopColor: '#3b82f6',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
};

const textStyle: CSSProperties = {
  color: '#6b7280',
  fontSize: 14,
};
