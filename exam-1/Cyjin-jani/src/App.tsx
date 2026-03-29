import './styles/App.css';

import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import {
  ErrorBoundary,
  type FallbackProps,
  getErrorMessage,
} from 'react-error-boundary';
import { Products } from './components/Products';

function App() {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <div className="w-full h-dvh bg-white mx-auto px-[80px]">
      <h1>🧪 Exam 1: 다중 필터 상품 목록</h1>
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
        <Products />
      </ErrorBoundary>
    </div>
  );
}

export default App;

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong :(</p>
      <pre style={{ color: 'red' }}>{getErrorMessage(error)}</pre>
      <button type="button" onClick={resetErrorBoundary}>
        Retry
      </button>
    </div>
  );
}
