import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { gapVariants } from '../gap';

const gridVariants = cva('grid', {
	variants: {
		cols: {
			1: 'grid-cols-1',
			2: 'grid-cols-2',
			3: 'grid-cols-3',
			4: 'grid-cols-4',
			5: 'grid-cols-5',
			6: 'grid-cols-6',
		},
		rows: {
			1: 'grid-rows-1',
			2: 'grid-rows-2',
			3: 'grid-rows-3',
			4: 'grid-rows-4',
			5: 'grid-rows-5',
			6: 'grid-rows-6',
		},
		gap: gapVariants,
	},
	defaultVariants: {
		gap: 2,
	},
});

export type GridProps = ComponentProps<'div'> &
	VariantProps<typeof gridVariants>;

export function Grid({ cols, rows, gap, className, ...props }: GridProps) {
	return (
		<div
			className={gridVariants({ cols, rows, gap, className })}
			{...props}
		/>
	);
}
