import type { HTMLAttributes } from 'react';
import { cn } from '@/libs/cn';

export const Skeleton = ({
	className,
	...rest
}: HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			className={cn('animate-pulse rounded-md bg-gray-200', className)}
			{...rest}
		/>
	);
};
