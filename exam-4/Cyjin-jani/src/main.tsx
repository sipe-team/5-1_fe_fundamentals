import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { DevToolPanel } from './DevToolPanel';
import { queryClient } from './api/queryClient';
import { initializeMockStorage } from './mocks/storage';
import './styles/index.css';

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
        <App />
      </QueryClientProvider>
    </StrictMode>,
  );
});
