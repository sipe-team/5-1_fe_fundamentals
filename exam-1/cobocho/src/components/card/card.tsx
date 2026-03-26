import type { HTMLAttributes } from 'react';
import { cn } from '@/libs/cn';

export const Card = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			className={cn(
				'rounded-lg border border-gray-200 bg-white p-4',
				className,
			)}
			{...rest}
		/>
	);
};
