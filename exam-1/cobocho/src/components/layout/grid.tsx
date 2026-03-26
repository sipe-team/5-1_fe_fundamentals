import type { HTMLAttributes } from 'react';
import { cn } from '@/libs/cn';

interface GridProps extends HTMLAttributes<HTMLDivElement> {
	columns?: number;
	gap?: number;
}

export const Grid = ({ columns = 1, gap, className, ...rest }: GridProps) => {
	return (
		<div
			className={cn(
				'grid',
				`grid-cols-${columns}`,
				gap !== undefined && `gap-${gap}`,
				className,
			)}
			{...rest}
		/>
	);
};
