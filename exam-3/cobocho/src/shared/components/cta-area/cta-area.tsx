import { cn } from '@/shared/lib/cn';
import type { ComponentProps } from 'react';

interface CtaAreaProps extends ComponentProps<'div'> {}

export function CtaArea({ className, children, ...props }: CtaAreaProps) {
	return (
		<div
			className={cn(
				'fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-4 py-3',
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}
