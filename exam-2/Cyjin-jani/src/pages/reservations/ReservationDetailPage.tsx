import { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { ReservationDetail } from '@/features/reservations/components/detail/ReservationDetail';
import { LoadingFallback } from '@/shared/components/LoadingFallback';
import { ReservationDetailErrorFallback } from '@/features/reservations/components/detail/ReservationDetailErrorFallback';

export function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  return (
    <main className="flex flex-col items-center w-full min-h-dvh max-w-[800px] mx-auto px-6 py-6">
      <h1 className="mb-6 text-2xl font-bold">회의실 예약 정보</h1>

      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={ReservationDetailErrorFallback}>
            <Suspense fallback={<LoadingFallback />}>
              <ReservationDetail id={id} />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </main>
  );
}
