import { type CSSProperties, Suspense } from 'react';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ChipDashboardContent } from './ChipDashboardContent';

export function ChipDashboardPage() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div style={fullCenterStyle}>
          <ErrorMessage message={error.message} onRetry={reset} />
        </div>
      )}
    >
      <Suspense
        fallback={
          <div style={fullCenterStyle}>
            <LoadingSpinner />
          </div>
        }
      >
        <ChipDashboardContent />
      </Suspense>
    </ErrorBoundary>
  );
}

const fullCenterStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
};
