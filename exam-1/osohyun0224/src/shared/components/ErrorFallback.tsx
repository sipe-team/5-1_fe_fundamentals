import type { FallbackProps } from 'react-error-boundary';
import { HttpError } from '@/shared/api/errors';

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const message =
    error instanceof HttpError
      ? error.message
      : '알 수 없는 오류가 발생했습니다.';

  return (
    <div className="error-message" role="alert">
      <p className="error-icon">⚠️</p>
      <p className="error-text">{message}</p>
      <button
        type="button"
        className="retry-button"
        onClick={resetErrorBoundary}
      >
        다시 시도
      </button>
    </div>
  );
}
