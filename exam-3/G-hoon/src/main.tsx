import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'sonner';
import App from './App';
import { ApiError } from './api/error';
import { ErrorFallback } from './components/common/ErrorFallback';
import { DevToolPanel } from './DevToolPanel';
import { initializeMockStorage } from './mocks/storage';
import './main.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status < 500) return false;
        return failureCount < 2;
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 4000),
      staleTime: 60_000,
    },
    mutations: {
      retry: 0,
    },
  },
});

async function enableMocking() {
  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

initializeMockStorage();

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary
          fallbackRender={({ resetErrorBoundary }) => (
            <ErrorFallback
              message="예상치 못한 오류가 발생했어요."
              onReset={() => {
                resetErrorBoundary();
                window.location.href = '/';
              }}
            />
          )}
        >
          <DevToolPanel />
          <App />
        </ErrorBoundary>
        <Toaster
          position="bottom-center"
          richColors
          mobileOffset={{ bottom: '80px' }}
          offset={{ bottom: '80px' }}
        />
      </QueryClientProvider>
    </React.StrictMode>,
  );
});
