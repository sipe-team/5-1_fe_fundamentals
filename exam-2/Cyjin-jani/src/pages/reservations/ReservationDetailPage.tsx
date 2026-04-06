import { Suspense } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { HTTPError } from 'ky';

import { ReservationDetail } from '@/features/reservations/components/ReservationDetail';
import { Button } from '@/shared/components/ui/button';

export function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  return (
    <main className="flex flex-col items-center w-full min-h-dvh max-w-[800px] mx-auto px-6 py-6">
      <h1 className="mb-6 text-2xl font-bold">회의실 예약 정보</h1>

      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
            <Suspense fallback={<p className="py-16 text-muted-foreground">로딩 중…</p>}>
              <ReservationDetail id={id} />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </main>
  );
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const is404 = error instanceof HTTPError && error.response.status === 404;

  if (is404) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-lg font-medium">예약을 찾을 수 없습니다.</p>
        <p className="text-sm text-muted-foreground">존재하지 않거나 이미 취소된 예약입니다.</p>
        <Button asChild variant="outline">
          <Link to="/">타임라인으로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-lg font-medium">데이터를 불러오지 못했습니다.</p>
      <Button variant="outline" onClick={resetErrorBoundary}>
        다시 시도
      </Button>
    </div>
  );
}
