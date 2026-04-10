import { type ReactNode, createContext, useContext } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const rootVariants = cva(
	'inline-flex items-center rounded-lg bg-gray-100 p-1',
	{
		variants: {
			size: {
				sm: 'h-8 text-sm',
				md: 'h-10 text-sm',
				lg: 'h-12 text-base',
			},
			fullWidth: {
				true: 'w-full',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	},
);

const itemVariants = cva(
	'inline-flex cursor-pointer items-center justify-center rounded-md font-medium transition-all select-none',
	{
		variants: {
			size: {
				sm: 'h-6 text-sm px-2',
				md: 'h-8 text-sm px-3',
				lg: 'h-10 text-base px-4',
			},
			active: {
				true: 'bg-white text-gray-900 shadow-sm',
				false: 'text-gray-500 hover:text-gray-700',
			},
			fullWidth: {
				true: 'flex-1',
			},
		},
		defaultVariants: {
			size: 'md',
			active: false,
		},
	},
);

interface SegmentContextValue {
	value: string | null;
	onSelect: (value: string) => void;
	size: VariantProps<typeof rootVariants>['size'];
	fullWidth: VariantProps<typeof rootVariants>['fullWidth'];
}

const SegmentContext = createContext<SegmentContextValue | null>(null);

function useSegmentContext() {
	const context = useContext(SegmentContext);
	if (!context) {
		throw new Error(
			'SegmentControl.Item must be used within SegmentControl.Root',
		);
	}
	return context;
}

interface RootProps extends VariantProps<typeof rootVariants> {
	value: string | null;
	onSelect: (value: string) => void;
	className?: string;
	children: ReactNode;
}

function Root({
	value,
	onSelect,
	size,
	fullWidth,
	className,
	children,
}: RootProps) {
	return (
		<SegmentContext.Provider value={{ value, onSelect, size, fullWidth }}>
			<div className={cn(rootVariants({ size, fullWidth }), className)}>
				{children}
			</div>
		</SegmentContext.Provider>
	);
}

// ── Item ──

interface ItemProps {
	value: string;
	className?: string;
	children: ReactNode;
}

function Item({ value, className, children }: ItemProps) {
	const { value: selected, onSelect, size, fullWidth } = useSegmentContext();

	return (
		<button
			type="button"
			className={cn(
				itemVariants({ size, fullWidth, active: selected === value }),
				className,
			)}
			onClick={() => onSelect(value)}
		>
			{children}
		</button>
	);
}

export const SegmentControl = {
	Root,
	Item,
};
