import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSearchParams } from 'react-router-dom';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { LoadingFallback } from '@/shared/components/LoadingFallback';
import { QueryErrorFallback } from '@/shared/components/QueryErrorFallback';

import { ReservationForm } from '@/features/reservations/components/create/ReservationForm';

export function ReservationAddPage() {
  const [searchParams] = useSearchParams();

  const roomId = searchParams.get('roomId') ?? '';
  const date = searchParams.get('date') ?? '';
  const startTime = searchParams.get('startTime') ?? '';

  return (
    <main className="flex flex-col items-center w-full h-dvh max-w-[800px] mx-auto px-6 py-6 overflow-hidden ">
      <h1 className="my-4 text-2xl font-bold">예약 생성</h1>

      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={QueryErrorFallback}>
            <Suspense fallback={<LoadingFallback />}>
              <ReservationForm
                defaultRoomId={roomId}
                defaultDate={date}
                defaultStartTime={startTime}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </main>
  );
}
