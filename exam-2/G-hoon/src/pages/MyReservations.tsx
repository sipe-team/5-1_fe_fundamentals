import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';
import { useMyReservations } from '@/features/my-reservations/hooks';
import { useRooms } from '@/features/timeline/hooks';
import { ErrorFallback, LoadingSpinner } from '@/shared/components';
import type { Reservation, Room } from '@/types/reservation';

function ReservationCard({
  reservation,
  room,
  onClick,
}: {
  reservation: Reservation;
  room?: Room;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-medium text-slate-900">
          {reservation.title}
        </h3>
        <span className="text-xs text-slate-400">
          {reservation.startTime} ~ {reservation.endTime}
        </span>
      </div>
      <p className="text-xs text-slate-500">
        {room ? room.name : reservation.roomId}
      </p>
    </button>
  );
}

function groupByDate(reservations: Reservation[]) {
  const groups = new Map<string, Reservation[]>();
  for (const r of reservations) {
    const list = groups.get(r.date) ?? [];
    list.push(r);
    groups.set(r.date, list);
  }
  return [...groups.entries()].sort(([a], [b]) => b.localeCompare(a));
}

function MyReservationsContent() {
  const navigate = useNavigate();
  const { data: reservations } = useMyReservations();
  const { data: rooms } = useRooms();

  const grouped = useMemo(() => groupByDate(reservations), [reservations]);

  if (reservations.length === 0) {
    return (
      <p className="text-sm text-slate-500 text-center py-12">
        생성한 예약이 없습니다.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {grouped.map(([date, items]) => (
        <section key={date}>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">{date}</h3>
          <div className="flex flex-col gap-2">
            {items.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                room={rooms.find((r) => r.id === reservation.roomId)}
                onClick={() => navigate(`/reservations/${reservation.id}`)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function MyReservations() {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-lg font-bold mb-6">내 예약</h2>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ resetErrorBoundary }) => (
              <ErrorFallback onReset={resetErrorBoundary} />
            )}
          >
            <Suspense fallback={<LoadingSpinner />}>
              <MyReservationsContent />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}
