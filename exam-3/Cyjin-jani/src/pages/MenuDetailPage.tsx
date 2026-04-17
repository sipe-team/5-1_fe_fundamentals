import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { useLocation, useRoute } from 'wouter';

import { MenuDetailContent } from '@/features/menu/components/MenuDetailContent';
import { MenuDetailGnb } from '@/features/menu/components/MenuDetailGnb';
import { MenuDetailSkeleton } from '@/features/menu/components/MenuDetailSkeleton';
import { MenuItemNotFound } from '@/features/menu/components/MenuItemNotFound';
import { HttpStatusErrorFallback } from '@/shared/components/HttpStatusErrorFallback';

export function MenuDetailPage() {
  const [, params] = useRoute('/menu/:itemId');
  const itemId = params!.itemId;
  const [, setLocation] = useLocation();

  return (
    <>
      <MenuDetailGnb onReturnToMenu={() => setLocation('/')} />
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={MenuDetailPageErrorFallback}>
            <Suspense fallback={<MenuDetailSkeleton />}>
              <MenuDetailContent key={itemId} itemId={itemId} />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </>
  );
}

function MenuDetailPageErrorFallback(props: FallbackProps) {
  return <HttpStatusErrorFallback {...props} httpStatusFallbacks={{ 404: <MenuItemNotFound /> }} />;
}
