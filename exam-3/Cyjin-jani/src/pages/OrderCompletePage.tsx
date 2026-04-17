import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { useLocation, useRoute } from 'wouter';

import { OrderCompleteContent } from '@/features/order/components/OrderCompleteContent';
import { Gnb } from '@/shared/components/Gnb';
import { OrderNotFound } from '@/features/order/components/OrderNotFound';
import { BottomCTA } from '@/shared/components/BottomCTA';
import { HttpStatusErrorFallback } from '@/shared/components/HttpStatusErrorFallback';
import { LoadingFallback } from '@/shared/components/LoadingFallback';

export function OrderCompletePage() {
  const [, params] = useRoute('/orders/:orderId');
  const orderId = params!.orderId;
  const [, setLocation] = useLocation();

  const goMenu = () => setLocation('/');

  return (
    <>
      <Gnb variant="home" title="주문 완료" onLeftClick={goMenu} />
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={OrderCompletePageErrorFallback}>
            <Suspense fallback={<LoadingFallback />}>
              <OrderCompleteContent orderId={orderId} />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
      <BottomCTA label="메뉴판으로 돌아가기" onClick={goMenu} />
    </>
  );
}

function OrderCompletePageErrorFallback(props: FallbackProps) {
  return <HttpStatusErrorFallback {...props} httpStatusFallbacks={{ 404: <OrderNotFound /> }} />;
}
