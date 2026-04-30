import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { DevToolPanel } from './DevToolPanel';
import { initializeMockStorage } from './mocks/storage';
import './main.css';

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
      <DevToolPanel />
      <App />
    </StrictMode>,
  );
});
