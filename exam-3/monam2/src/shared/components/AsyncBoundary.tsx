import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

import DefaultError from "@/shared/components/DefaultError";
import Spinner from "@/shared/components/Spinner";

interface AsyncBoundaryProps {
  children: React.ReactNode;
  errorFallback?: React.ComponentType<FallbackProps>;
  suspenseFallback?: React.ReactNode;
}

export default function AsyncBoundary({
  children,
  errorFallback: ErrorFallback = DefaultError,
  suspenseFallback = <Spinner />,
}: AsyncBoundaryProps) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
      <Suspense fallback={suspenseFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}
