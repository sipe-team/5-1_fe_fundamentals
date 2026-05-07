import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';
import { Suspense, type ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

interface TestProviderProps {
	children: ReactNode;
}

export function TestProvider({ children }: TestProviderProps) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	return (
		<QueryClientProvider client={queryClient}>
			<MemoryRouter>
				<NuqsTestingAdapter>
					<Suspense>{children}</Suspense>
				</NuqsTestingAdapter>
			</MemoryRouter>
		</QueryClientProvider>
	);
}
