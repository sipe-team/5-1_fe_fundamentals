import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { DevToolPanel } from './DevToolPanel'
import { initializeMockStorage } from './mocks/storage'
import './styles/reset.css'

const queryClient = new QueryClient()

async function enableMocking() {
  const { worker } = await import('./mocks/browser')
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

initializeMockStorage();

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <DevToolPanel/>
        <App/>
      </QueryClientProvider>
    </React.StrictMode>,
  );
});
