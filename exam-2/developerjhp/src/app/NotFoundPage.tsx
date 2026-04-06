import { css } from '@emotion/react';
import { Link } from 'react-router';
import { spacing } from '@/styles/tokens';

export function NotFoundPage() {
  return (
    <div css={css`text-align: center; padding: ${spacing.xxl};`}>
      <h1>404</h1>
      <p>페이지를 찾을 수 없습니다.</p>
      <Link to="/" css={css`margin-top: ${spacing.md}; display: inline-block;`}>
        타임라인으로 돌아가기
      </Link>
    </div>
  );
}
