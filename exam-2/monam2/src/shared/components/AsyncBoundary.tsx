import { Suspense } from "react";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

import DefaultError from "./DefaultError";

interface AsyncBoundaryProps {
  children: React.ReactNode;
  errorFallback?: React.ComponentType<FallbackProps>;
  suspenseFallback?: React.ReactNode;
}

export default function AsyncBoundary({
  children,
  errorFallback: ErrorFallback = DefaultError,
  suspenseFallback,
}: AsyncBoundaryProps) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
      <Suspense fallback={suspenseFallback ?? <div>로딩 중...</div>}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
