import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { gapVariants } from '../gap';

const flexVariants = cva('flex', {
	variants: {
		direction: {
			row: 'flex-row',
			col: 'flex-col',
			rowReverse: 'flex-row-reverse',
			colReverse: 'flex-col-reverse',
		},
		align: {
			start: 'items-start',
			center: 'items-center',
			end: 'items-end',
			stretch: 'items-stretch',
			baseline: 'items-baseline',
		},
		justify: {
			start: 'justify-start',
			center: 'justify-center',
			end: 'justify-end',
			between: 'justify-between',
			around: 'justify-around',
			evenly: 'justify-evenly',
		},
		wrap: {
			wrap: 'flex-wrap',
			nowrap: 'flex-nowrap',
			wrapReverse: 'flex-wrap-reverse',
		},
		gap: gapVariants,
	},
	defaultVariants: {
		gap: 2,
	},
});

type FlexProps = ComponentProps<'div'> & VariantProps<typeof flexVariants>;

export function Flex({
	direction,
	align,
	justify,
	wrap,
	gap,
	className,
	...props
}: FlexProps) {
	return (
		<div
			className={flexVariants({ direction, align, justify, wrap, gap, className })}
			{...props}
		/>
	);
}
