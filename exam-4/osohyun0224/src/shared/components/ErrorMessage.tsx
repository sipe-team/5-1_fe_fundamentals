import type { CSSProperties } from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div style={containerStyle}>
      <p style={iconStyle}>!</p>
      <p style={messageStyle}>{message}</p>
      <button type="button" onClick={onRetry} style={buttonStyle}>
        다시 시도
      </button>
    </div>
  );
}

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '48px 24px',
  gap: 12,
};

const iconStyle: CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: '#fef2f2',
  color: '#dc2626',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: 20,
  margin: 0,
  lineHeight: '40px',
  textAlign: 'center',
};

const messageStyle: CSSProperties = {
  color: '#dc2626',
  fontSize: 14,
  margin: 0,
  textAlign: 'center',
};

const buttonStyle: CSSProperties = {
  padding: '8px 20px',
  border: '1px solid #d1d5db',
  borderRadius: 8,
  backgroundColor: '#ffffff',
  color: '#374151',
  fontSize: 14,
  cursor: 'pointer',
  fontWeight: 500,
};
