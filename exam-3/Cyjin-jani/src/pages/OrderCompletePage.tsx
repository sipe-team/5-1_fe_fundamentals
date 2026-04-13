import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useLocation, useRoute } from 'wouter';

import { OrderCompleteContent } from '@/features/order/components/OrderCompleteContent';
import { OrderCompleteErrorFallback } from '@/features/order/components/OrderCompleteErrorFallback';
import { OrderCompleteGnb } from '@/features/order/components/OrderCompleteGnb';
import { BottomCTA } from '@/shared/components/BottomCTA';
import { LoadingFallback } from '@/shared/components/LoadingFallback';

export function OrderCompletePage() {
  const [, params] = useRoute('/orders/:orderId');
  const orderId = params?.orderId;
  const [, setLocation] = useLocation();

  const goMenu = () => setLocation('/');

  if (!orderId) return null;

  return (
    <>
      <OrderCompleteGnb onReturnToMenu={goMenu} />
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            fallbackRender={(props) => (
              <OrderCompleteErrorFallback {...props} />
            )}
          >
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
