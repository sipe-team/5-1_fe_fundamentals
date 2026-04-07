import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate, useParams } from 'react-router-dom';
import { useMyReservations } from '@/features/my-reservations/hooks';
import { ReservationInfo } from '@/features/reservation/components';
import {
  useDeleteReservation,
  useReservation,
} from '@/features/reservation/hooks';
import { useRooms } from '@/features/timeline/hooks';
import { LoadingSpinner } from '@/shared/components';

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center gap-4 py-24">
      <p className="text-sm text-slate-500">해당 예약을 찾을 수 없습니다.</p>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="text-sm px-4 py-1.5 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
      >
        타임라인으로 이동
      </button>
    </div>
  );
}

function ReservationDetailContent({ id }: { id: string }) {
  const { data: reservation } = useReservation(id);
  const { data: rooms } = useRooms();
  const { data: myReservations } = useMyReservations();
  const deleteMutation = useDeleteReservation();
  const [showConfirm, setShowConfirm] = useState(false);

  const room = rooms.find((r) => r.id === reservation.roomId);
  const isMine = myReservations.some((r) => r.id === id);

  const handleDelete = () => {
    deleteMutation.mutate(id);
  };

  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          &larr; 뒤로
        </button>
        <h2 className="text-lg font-bold">예약 상세</h2>
      </div>

      <div className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
        <ReservationInfo reservation={reservation} room={room} />
      </div>

      {isMine && (
        <div className="mt-6 w-full">
          {!showConfirm ? (
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="w-full text-sm px-4 py-2 rounded-md border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
            >
              예약 취소
            </button>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 flex-1">
                정말 이 예약을 취소하시겠습니까?
              </p>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="text-sm px-4 py-1.5 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleteMutation.isPending ? '취소 중...' : '확인'}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="text-sm px-4 py-1.5 rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                돌아가기
              </button>
            </div>
          )}

          {deleteMutation.isError && (
            <p className="mt-3 text-xs text-red-500">
              예약 취소에 실패했습니다. 잠시 후 다시 시도해주세요.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function DetailErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: unknown;
  resetErrorBoundary: () => void;
}) {
  if (error instanceof HTTPError && error.response.status === 404) {
    return <NotFound />;
  }

  return (
    <div className="flex flex-col items-center gap-4 py-24">
      <p className="text-sm text-slate-500">
        데이터를 불러오는데 실패했습니다.
      </p>
      <button
        type="button"
        onClick={resetErrorBoundary}
        className="text-sm px-5 py-2 rounded-md bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
      >
        다시 시도
      </button>
    </div>
  );
}

export default function ReservationDetail() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <NotFound />;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          resetKeys={[id]}
          fallbackRender={DetailErrorFallback}
        >
          <Suspense fallback={<LoadingSpinner />}>
            <ReservationDetailContent id={id} />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
