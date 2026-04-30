import { css } from '@emotion/react';
import type { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
  return <main css={layoutStyle}>{children}</main>;
}

const layoutStyle = css({
  minHeight: '100dvh',
  background: '#ffffff',
});
