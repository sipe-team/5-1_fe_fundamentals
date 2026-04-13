import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { DevToolPanel } from './DevToolPanel';
import { initializeMockStorage } from './mocks/storage';
import './styles/reset.css';

async function enableMocking() {
  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

function renderApp() {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <DevToolPanel />
      <App />
    </React.StrictMode>,
  );
}

initializeMockStorage();

enableMocking()
  .catch((error) => {
    console.error('MSW 초기화에 실패했습니다.', error);
  })
  .finally(() => {
    renderApp();
  });
