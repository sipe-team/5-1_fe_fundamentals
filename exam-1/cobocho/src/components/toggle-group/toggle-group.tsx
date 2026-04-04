import { createContext, useContext, type ReactNode } from 'react';
import { cn } from '@/libs/cn';

interface ToggleGroupSingleProps {
	type: 'single';
	value: string | null;
	onChange: (value: string | null) => void;
	children: ReactNode;
	className?: string;
}

interface ToggleGroupMultipleProps {
	type: 'multiple';
	value: string[];
	onChange: (value: string[]) => void;
	children: ReactNode;
	className?: string;
}

type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

interface ToggleGroupContextValue {
	type: 'single' | 'multiple';
	isSelected: (value: string) => boolean;
	toggle: (value: string) => void;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

const useToggleGroup = () => {
	const context = useContext(ToggleGroupContext);
	if (!context) {
		throw new Error('ToggleGroupItem must be used within a ToggleGroup');
	}
	return context;
};

export const ToggleGroup = (props: ToggleGroupProps) => {
	const { type, children, className } = props;

	const contextValue: ToggleGroupContextValue =
		type === 'single'
			? {
					type,
					isSelected: (v) => (props as ToggleGroupSingleProps).value === v,
					toggle: (v) => {
						const p = props as ToggleGroupSingleProps;
						p.onChange(p.value === v ? null : v);
					},
			  }
			: {
					type,
					isSelected: (v) =>
						(props as ToggleGroupMultipleProps).value.includes(v),
					toggle: (v) => {
						const p = props as ToggleGroupMultipleProps;
						const next = p.value.includes(v)
							? p.value.filter((item) => item !== v)
							: [...p.value, v];
						p.onChange(next);
					},
			  };

	return (
		<ToggleGroupContext.Provider value={contextValue}>
			<fieldset className={cn('flex gap-1', className)}>{children}</fieldset>
		</ToggleGroupContext.Provider>
	);
};

interface ToggleGroupItemProps {
	value: string;
	children: ReactNode;
	className?: string;
}

export const ToggleGroupItem = ({
	value,
	children,
	className,
}: ToggleGroupItemProps) => {
	const { isSelected, toggle } = useToggleGroup();
	const selected = isSelected(value);

	return (
		<button
			type="button"
			aria-pressed={selected}
			data-state={selected ? 'on' : 'off'}
			className={cn(
				'rounded-md border px-3 py-1.5 text-sm transition-colors',
				selected
					? 'border-black bg-black text-white'
					: 'border-gray-300 bg-white text-gray-600 hover:bg-gray-100',
				className,
			)}
			onClick={() => toggle(value)}
		>
			{children}
		</button>
	);
};
