import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { gapVariants } from '../gap';

const vstackVariants = cva('flex flex-col', {
	variants: {
		align: {
			start: 'items-start',
			center: 'items-center',
			end: 'items-end',
			stretch: 'items-stretch',
		},
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

type VStackProps = ComponentProps<'div'> & VariantProps<typeof vstackVariants>;

export function VStack({
	align,
	justify,
	gap,
	className,
	...props
}: VStackProps) {
	return (
		<div
			className={vstackVariants({ align, justify, gap, className })}
			{...props}
		/>
	);
}
