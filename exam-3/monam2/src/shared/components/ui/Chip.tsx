import { css } from '@emotion/react';
import type { HTMLAttributes } from 'react';

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  active?: boolean;
  label: string;
}

export default function Chip({ active = false, label, ...rest }: ChipProps) {
  return (
    <span css={[chipStyle, active && activeChipStyle]} {...rest}>
      {label}
    </span>
  );
}

const chipStyle = css({
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  height: '36px',
  padding: '0 12px',
  borderRadius: '9999px',
  backgroundColor: '#fff7ed',
  color: '#c2410c',
  fontWeight: 600,
  transition: 'background-color 150ms ease, color 150ms ease',
});

const activeChipStyle = css({
  backgroundColor: '#c2410c',
  color: '#ffffff',
});
