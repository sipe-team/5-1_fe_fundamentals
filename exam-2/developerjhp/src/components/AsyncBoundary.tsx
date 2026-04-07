import type { ReactNode } from "react";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorFallback } from "@/components/ErrorFallback";

interface ErrorFallbackProps {
  error: Error;
  reset: () => void;
}

interface AsyncBoundaryProps {
  children: ReactNode;
  pendingFallback?: ReactNode;
  errorFallback?: (props: ErrorFallbackProps) => ReactNode;
}

export function AsyncBoundary({
  children,
  pendingFallback = <p>로딩 중...</p>,
  errorFallback = (props) => <ErrorFallback error={props.error} reset={props.reset} />,
}: AsyncBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallback={(props) => errorFallback({ error: props.error, reset: props.reset })}
        >
          <Suspense fallback={pendingFallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
