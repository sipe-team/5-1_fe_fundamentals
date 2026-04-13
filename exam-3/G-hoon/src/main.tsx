import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';
import App from './App';
import { ApiError } from './api/error';
import { DevToolPanel } from './DevToolPanel';
import { initializeMockStorage } from './mocks/storage';
import './main.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status < 500) return false;
        return failureCount < 1;
      },
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
        <DevToolPanel />
        <App />
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
