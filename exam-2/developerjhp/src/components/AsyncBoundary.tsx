import type { ReactNode } from 'react';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorFallback } from '@/components/ErrorFallback';

interface AsyncBoundaryProps {
  children: ReactNode;
}

export function AsyncBoundary({ children }: AsyncBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallback={(props) => (
            <ErrorFallback error={props.error} reset={props.reset} />
          )}
        >
          <Suspense fallback={<p>로딩 중...</p>}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
