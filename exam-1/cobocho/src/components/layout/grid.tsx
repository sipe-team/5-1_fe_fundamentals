import type { HTMLAttributes } from 'react';
import { cn } from '@/libs/cn';
import { type Gap, gapMap } from './layout.styles';

type Columns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface GridProps extends HTMLAttributes<HTMLDivElement> {
	columns?: Columns;
	gap?: Gap;
}

export const Grid = ({
	columns = 1,
	gap = 2,
	className,
	...rest
}: GridProps) => {
	return (
		<div
			className={cn(
				'grid',
				columns === 1 && 'grid-cols-1',
				columns === 2 && 'grid-cols-2',
				columns === 3 && 'grid-cols-3',
				columns === 4 && 'grid-cols-4',
				columns === 5 && 'grid-cols-5',
				columns === 6 && 'grid-cols-6',
				columns === 7 && 'grid-cols-7',
				columns === 8 && 'grid-cols-8',
				columns === 9 && 'grid-cols-9',
				columns === 10 && 'grid-cols-10',
				columns === 11 && 'grid-cols-11',
				columns === 12 && 'grid-cols-12',
				gapMap[gap],
				className,
			)}
			{...rest}
		/>
	);
};
