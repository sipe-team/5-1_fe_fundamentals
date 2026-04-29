import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense, type ReactNode } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { ErrorFallback } from '@/components/common/fallbacks/ErrorFallback';
import { LoadingFallback } from '@/components/common/fallbacks/LoadingFallback';

interface AsyncBoundaryProps {
  children: ReactNode;
  resetKeys?: unknown[];
  errorFallback?: (props: FallbackProps) => ReactNode;
  loadingFallback?: ReactNode;
}

export function AsyncBoundary({
  children,
  resetKeys,
  errorFallback,
  loadingFallback,
}: AsyncBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          resetKeys={resetKeys}
          fallbackRender={(props) =>
            errorFallback ? errorFallback(props) : <ErrorFallback {...props} title="데이터를 불러오지 못했습니다." />
          }
        >
          <Suspense fallback={loadingFallback ?? <LoadingFallback message="데이터를 불러오는 중..." />}>
            {children}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
