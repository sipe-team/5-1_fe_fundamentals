import type { ComponentProps, ComponentType, ReactNode } from 'react';
import { Suspense } from '@suspensive/react';

import { QueryErrorBoundary } from '@/shared/components/query-error-boundary';

interface ScaffoldProps {
	error: ReactNode;
	fallback: ReactNode;
	children: ReactNode;
}

export function Scaffold({ error, fallback, children }: ScaffoldProps) {
	return (
		<QueryErrorBoundary fallback={error}>
			<Suspense fallback={fallback}>{children}</Suspense>
		</QueryErrorBoundary>
	);
}

interface ScaffoldWithOptions {
	error: ReactNode;
	fallback: ReactNode;
}

Scaffold.with = function scaffoldWith<
	TProps extends ComponentProps<ComponentType> = Record<string, never>,
>(options: ScaffoldWithOptions, Component: ComponentType<TProps>) {
	function Wrapped(props: TProps) {
		return (
			<Scaffold
				error={options.error}
				fallback={options.fallback}
			>
				<Component {...props} />
			</Scaffold>
		);
	}
	Wrapped.displayName = `Scaffold.with(${Component.displayName || Component.name || 'Component'})`;
	return Wrapped;
};
