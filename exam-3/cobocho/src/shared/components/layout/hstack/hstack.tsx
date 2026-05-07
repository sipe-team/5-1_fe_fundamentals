import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { gapVariants } from '../gap';

const hstackVariants = cva('flex flex-row items-center', {
	variants: {
		justify: {
			start: 'justify-start',
			center: 'justify-center',
			end: 'justify-end',
			between: 'justify-between',
		},
		gap: gapVariants,
	},
	defaultVariants: {
		gap: 2,
	},
});

type HStackProps = ComponentProps<'div'> & VariantProps<typeof hstackVariants>;

export function HStack({
	justify,
	gap,
	className,
	...props
}: HStackProps) {
	return (
		<div
			className={hstackVariants({ justify, gap, className })}
			{...props}
		/>
	);
}
