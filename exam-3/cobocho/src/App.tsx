import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<NuqsAdapter>
				<RouterProvider router={router} />
			</NuqsAdapter>
			<ReactQueryDevtools />
		</QueryClientProvider>
	);
}

export default App;
