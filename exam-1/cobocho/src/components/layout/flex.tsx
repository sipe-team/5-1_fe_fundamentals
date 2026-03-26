import type { HTMLAttributes } from 'react';
import { cn } from '@/libs/cn';

interface FlexProps extends HTMLAttributes<HTMLDivElement> {
	direction?: 'row' | 'column';
	align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
	justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
	wrap?: boolean;
	gap?: number;
}

const alignMap = {
	start: 'items-start',
	center: 'items-center',
	end: 'items-end',
	stretch: 'items-stretch',
	baseline: 'items-baseline',
} as const;

const justifyMap = {
	start: 'justify-start',
	center: 'justify-center',
	end: 'justify-end',
	between: 'justify-between',
	around: 'justify-around',
	evenly: 'justify-evenly',
} as const;

export const Flex = ({
	direction = 'row',
	align,
	justify,
	wrap,
	gap,
	className,
	...rest
}: FlexProps) => {
	return (
		<div
			className={cn(
				'flex',
				direction === 'column' && 'flex-col',
				align && alignMap[align],
				justify && justifyMap[justify],
				wrap && 'flex-wrap',
				gap !== undefined && `gap-${gap}`,
				className,
			)}
			{...rest}
		/>
	);
};

export const HStack = ({
	className,
	...rest
}: Omit<FlexProps, 'direction'>) => {
	return <Flex direction="row" align="center" className={className} {...rest} />;
};

export const VStack = ({
	className,
	...rest
}: Omit<FlexProps, 'direction'>) => {
	return <Flex direction="column" className={className} {...rest} />;
};
