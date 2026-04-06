import { css } from '@emotion/react';
import { spacing } from '@/styles/tokens';

interface ErrorFallbackProps {
  error: Error;
  reset: () => void;
}

export function ErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <div css={css`padding: ${spacing.xl}; text-align: center;`}>
      <h2>오류가 발생했습니다</h2>
      <p>{error.message}</p>
      <button type="button" onClick={reset} css={css`margin-top: ${spacing.md}; padding: ${spacing.sm} ${spacing.lg}; cursor: pointer;`}>
        다시 시도
      </button>
    </div>
  );
}
