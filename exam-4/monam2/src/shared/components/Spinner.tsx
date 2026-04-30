import { css } from '@emotion/react';

export default function Spinner() {
  return (
    <div css={wrapperStyle} role="status" aria-live="polite">
      <span css={spinnerStyle} aria-hidden="true" />
      <span>로딩 중...</span>
    </div>
  );
}

const wrapperStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  minHeight: '160px',
  color: '#4b5563',
});

const spinnerStyle = css({
  width: '20px',
  height: '20px',
  borderRadius: '9999px',
  border: '2px solid currentColor',
  borderTopColor: 'transparent',
  animation: 'spin 0.75s linear infinite',
  '@keyframes spin': {
    to: {
      transform: 'rotate(360deg)',
    },
  },
});
