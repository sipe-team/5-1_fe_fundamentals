import { HTTPError } from 'ky';
import type { FallbackProps } from 'react-error-boundary';

import { ErrorFallback } from '@/shared/components/ErrorFallback';

import { OrderNotFound } from './OrderNotFound';

export function OrderCompleteErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const is404 = error instanceof HTTPError && error.response.status === 404;

  if (is404) return <OrderNotFound />;

  return <ErrorFallback resetErrorBoundary={resetErrorBoundary} />;
}
