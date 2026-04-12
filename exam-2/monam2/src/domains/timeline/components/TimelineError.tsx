import { css } from '@emotion/react';
import type { FallbackProps } from 'react-error-boundary';

import { Button } from '@/shared/ui';

export default function TimelineError({ resetErrorBoundary }: FallbackProps) {
  return (
    <section css={errorStyle}>
      <p css={errorTitleStyle}>⚠️ 데이터를 불러오는 중 오류가 발생했습니다.</p>
      <div css={actionStyle}>
        <Button type="button" variant="secondary" onClick={resetErrorBoundary}>
          다시 시도
        </Button>
      </div>
    </section>
  );
}

const errorStyle = css({
  display: 'grid',
  gap: '12px',
  marginTop: '32px',
  padding: '24px',
  borderRadius: '8px',
  backgroundColor: '#fffaf5',
  border: '1px solid #ffedd5',
});

const errorTitleStyle = css({
  margin: 0,
  fontWeight: 700,
  color: '#c2410c',
});

const actionStyle = css({
  display: 'flex',
  justifyContent: 'flex-start',
});
