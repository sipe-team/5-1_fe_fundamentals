import { HTTPError } from 'ky';
import type { ReactNode } from 'react';
import type { FallbackProps } from 'react-error-boundary';

import { ErrorFallback } from '@/shared/components/ErrorFallback';

export type HttpStatusErrorFallbackProps = FallbackProps & {
  httpStatusFallbacks?: Partial<Record<number, ReactNode>>;
};

export function HttpStatusErrorFallback({
  error,
  resetErrorBoundary,
  httpStatusFallbacks,
}: HttpStatusErrorFallbackProps) {
  if (error instanceof HTTPError) {
    const statusFallback = httpStatusFallbacks?.[error.response.status];
    if (statusFallback != null) return statusFallback;
  }

  return <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />;
}
