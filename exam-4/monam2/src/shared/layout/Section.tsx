import { css } from '@emotion/react';
import type { PropsWithChildren } from 'react';

export default function Section({ children }: PropsWithChildren) {
  return <section css={sectionStyle}>{children}</section>;
}

const sectionStyle = css({
  display: 'grid',
  gap: '24px',
  gridTemplateColumns: '280px 1fr',
  height: '960px',
});
