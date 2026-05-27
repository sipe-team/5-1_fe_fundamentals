import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ReservationForm } from '@/features/reservation/components';
import { useCreateReservation } from '@/features/reservation/hooks';
import { useRooms } from '@/features/timeline/hooks';
import { ErrorFallback, LoadingSpinner } from '@/shared/components';
import type { CreateReservationRequest } from '@/types/reservation';

function ReservationNewContent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: rooms } = useRooms();
  const mutation = useCreateReservation();

  const defaultValues: Partial<CreateReservationRequest> = {
    roomId: searchParams.get('roomId') ?? undefined,
    date: searchParams.get('date') ?? undefined,
    startTime: searchParams.get('startTime') ?? undefined,
    endTime: searchParams.get('endTime') ?? undefined,
  };

  const handleSubmit = async (values: CreateReservationRequest) => {
    await mutation.mutateAsync(values);
    navigate('/');
  };

  return (
    <div className="w-full max-w-full flex flex-col items-center justify-center">
      <h2 className="text-lg font-bold mb-6">예약 생성</h2>
      <ReservationForm
        key={`${defaultValues.roomId ?? ''}-${defaultValues.date ?? ''}-${
          defaultValues.startTime ?? ''
        }-${defaultValues.endTime ?? ''}`}
        rooms={rooms}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isPending={mutation.isPending}
      />
    </div>
  );
}

export default function ReservationNew() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <ErrorFallback onReset={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<LoadingSpinner />}>
            <ReservationNewContent />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
