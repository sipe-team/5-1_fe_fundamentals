import { css } from '@emotion/react';
import type { PropsWithChildren } from 'react';

export default function Container({ children }: PropsWithChildren) {
  return <div css={containerStyle}>{children}</div>;
}

const containerStyle = css({
  width: '100%',
  height: '100%',
  margin: '0 auto',
  padding: '32px 24px 64px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});
