import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { type ReactNode, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
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
              <ErrorFallback onReset={resetErrorBoundary} />
            )
          }
        >
          <Suspense fallback={fallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
