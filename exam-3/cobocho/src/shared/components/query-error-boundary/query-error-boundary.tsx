import {
	type ComponentProps,
	type ComponentPropsWithoutRef,
	type ComponentRef,
	type ComponentType,
	forwardRef,
} from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from '@suspensive/react';

type ErrorBoundaryProps = ComponentPropsWithoutRef<typeof ErrorBoundary>;

export const QueryErrorBoundary = Object.assign(
	forwardRef<ComponentRef<typeof ErrorBoundary>, ErrorBoundaryProps>(
		(props, ref) => {
			const { reset } = useQueryErrorResetBoundary();

			return (
				<ErrorBoundary
					ref={ref}
					onReset={reset}
					{...props}
				/>
			);
		},
	),
	{
		with: <
			TProps extends ComponentProps<ComponentType> = Record<string, never>,
		>(
			errorBoundaryProps: Omit<ErrorBoundaryProps, 'children'>,
			Component: ComponentType<TProps>,
		) => {
			function Wrapped(props: TProps) {
				const { reset } = useQueryErrorResetBoundary();

				return (
					<ErrorBoundary
						onReset={reset}
						{...errorBoundaryProps}
					>
						<Component {...props} />
					</ErrorBoundary>
				);
			}
			Wrapped.displayName = `QueryErrorBoundary.with(${
				Component.displayName || Component.name || 'Component'
			})`;
			return Wrapped;
		},
	},
);

QueryErrorBoundary.displayName = 'QueryErrorBoundary';
