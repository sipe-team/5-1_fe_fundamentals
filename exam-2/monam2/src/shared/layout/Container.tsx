import { css } from '@emotion/react';

export default function Container({ children }: { children: React.ReactNode }) {
  return <div css={containerStyle}>{children}</div>;
}

const containerStyle = css({
  width: '100%',
  maxWidth: '960px',
  margin: '0 auto',
});
