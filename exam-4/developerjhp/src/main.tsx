import { SuspenseQuery } from '@suspensive/react-query';
import {
  QueryClient,
  QueryClientProvider,
  QueryErrorResetBoundary,
} from '@tanstack/react-query';
import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DevToolPanel } from './DevToolPanel';
import { membersQueryOptions } from './dashboard/queries';
import { initializeMockStorage } from './mocks/storage';
import './styles/reset.css';

const queryClient = new QueryClient();

async function enableMocking() {
  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

initializeMockStorage();

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <DevToolPanel />
        <QueryErrorResetBoundary>
          {({ reset: resetQueryError }) => (
            <ErrorBoundary
              onReset={resetQueryError}
              fallback={({ error, reset }) => (
                <div style={{ padding: 40, textAlign: 'center' }}>
                  <p style={{ color: '#dc2626', marginBottom: 12 }}>
                    {error.message}
                  </p>
                  <button
                    type="button"
                    onClick={reset}
                    style={{
                      padding: '6px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: 6,
                      background: 'white',
                    }}
                  >
                    다시 시도
                  </button>
                </div>
              )}
            >
              <Suspense
                fallback={
                  <div
                    style={{
                      padding: 40,
                      textAlign: 'center',
                      color: '#9ca3af',
                    }}
                  >
                    로딩 중...
                  </div>
                }
              >
                <SuspenseQuery {...membersQueryOptions()}>
                  {({ data: members }) => <App members={members} />}
                </SuspenseQuery>
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </QueryClientProvider>
    </StrictMode>,
  );
});
