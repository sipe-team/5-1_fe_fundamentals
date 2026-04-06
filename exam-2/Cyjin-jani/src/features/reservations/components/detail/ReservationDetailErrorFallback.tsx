import { Link } from 'react-router-dom';
import { type FallbackProps } from 'react-error-boundary';
import { HTTPError } from 'ky';

import { QueryErrorFallback } from '@/shared/components/QueryErrorFallback';
import { Button } from '@/shared/components/ui/button';

export function ReservationDetailErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
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

  return <QueryErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />;
}
