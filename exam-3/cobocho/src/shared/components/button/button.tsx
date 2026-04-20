import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';
import type { ComponentProps } from 'react';

const buttonVariants = cva(
	'inline-flex items-center justify-center font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
	{
		variants: {
			variant: {
				primary: 'bg-gray-900 text-white hover:bg-gray-800',
				secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
				outline: 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50',
				ghost: 'text-gray-600 hover:bg-gray-100',
			},
			size: {
				sm: 'h-8 rounded-md px-3 text-sm',
				md: 'h-10 rounded-lg px-4 text-sm',
				lg: 'h-12 rounded-lg px-6 text-base',
			},
			fullWidth: {
				true: 'w-full',
			},
		},
		defaultVariants: {
			variant: 'primary',
			size: 'md',
		},
	},
);

type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants>;

export function Button({
	variant,
	size,
	fullWidth,
	className,
	...props
}: ButtonProps) {
	return (
		<button
			type="button"
			className={cn(buttonVariants({ variant, size, fullWidth }), className)}
			{...props}
		/>
	);
}
