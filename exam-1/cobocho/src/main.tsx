import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './libs/query-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

async function enableMocking() {
	const { worker } = await import('./mocks/browser');
	return worker.start({
		onUnhandledRequest: 'bypass',
	});
}

enableMocking().then(() => {
	ReactDOM.createRoot(document.getElementById('root')!).render(
		<React.StrictMode>
			<QueryClientProvider client={queryClient}>
				<App />
				<ReactQueryDevtools />
			</QueryClientProvider>
		</React.StrictMode>,
	);
});
