import { css } from '@emotion/react';

export default function Section({ children }: { children: React.ReactNode }) {
  return <section css={sectionStyle}>{children}</section>;
}

const sectionStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
});
