import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { type ReactNode, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ApiError } from '@/api/error';
import { ErrorFallback } from './ErrorFallback';

interface AsyncQueryBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  errorFallback?: (reset: () => void, error: unknown) => ReactNode;
}

export function AsyncQueryBoundary({
  children,
  fallback,
  errorFallback,
}: AsyncQueryBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) =>
            errorFallback?.(resetErrorBoundary, error) ?? (
              <ErrorFallback
                onReset={resetErrorBoundary}
                message={error instanceof ApiError ? error.message : undefined}
              />
            )
          }
        >
          <Suspense fallback={fallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
