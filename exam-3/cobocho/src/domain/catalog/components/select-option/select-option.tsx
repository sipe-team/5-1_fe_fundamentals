import { useState, createContext, useContext, type ReactNode } from 'react';
import { VStack } from '@/shared/components/layout';
import { BottomSheet } from '@/shared/components/bottom-sheet';
import { cn } from '@/shared/lib/cn';

// ── Context ──

interface SelectOptionContextValue {
	selected: string | null;
	onSelect: (label: string | null) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
}

const SelectOptionContext = createContext<SelectOptionContextValue | null>(
	null,
);

function useSelectOptionContext() {
	const context = useContext(SelectOptionContext);
	if (!context) {
		throw new Error('SelectOption.* must be used within SelectOption.Root');
	}
	return context;
}

// ── Root ──

interface RootProps {
	selected: string | null;
	onSelect: (label: string | null) => void;
	children: ReactNode;
}

function Root({ selected, onSelect, children }: RootProps) {
	const [open, setOpen] = useState(false);

	return (
		<SelectOptionContext.Provider value={{ selected, onSelect, open, setOpen }}>
			<VStack gap={2}>{children}</VStack>
		</SelectOptionContext.Provider>
	);
}

// ── Label ──

function Label({ children }: { children: ReactNode }) {
	return <span className="text-sm font-medium text-gray-700">{children}</span>;
}

// ── Trigger ──

interface TriggerProps {
	placeholder?: string;
}

function Trigger({ placeholder = '선택' }: TriggerProps) {
	const { selected, open, setOpen } = useSelectOptionContext();

	return (
		<BottomSheet.Root
			open={open}
			onOpenChange={setOpen}
		>
			<BottomSheet.Trigger asChild>
				<button
					type="button"
					className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm"
				>
					<span className={selected ? 'text-gray-900' : 'text-gray-400'}>
						{selected ?? placeholder}
					</span>
					<span className="text-gray-400">▼</span>
				</button>
			</BottomSheet.Trigger>
		</BottomSheet.Root>
	);
}

// ── Sheet ──

function Sheet({ title, children }: { title: string; children: ReactNode }) {
	const { open, setOpen } = useSelectOptionContext();

	return (
		<BottomSheet.Root
			open={open}
			onOpenChange={setOpen}
		>
			<BottomSheet.Content>
				<BottomSheet.Title>{title}</BottomSheet.Title>
				{children}
			</BottomSheet.Content>
		</BottomSheet.Root>
	);
}

// ── Item ──

interface ItemProps {
	label: string;
	price?: number;
}

function Item({ label, price = 0 }: ItemProps) {
	const { selected, onSelect, setOpen } = useSelectOptionContext();
	const isSelected = selected === label;

	return (
		<button
			type="button"
			className={cn(
				'flex items-center justify-between rounded-lg px-4 py-3 text-sm',
				isSelected
					? 'bg-gray-100 font-medium text-gray-900'
					: 'text-gray-600 hover:bg-gray-50',
			)}
			onClick={() => {
				onSelect(label);
				setOpen(false);
			}}
		>
			<span>{label}</span>
			{price > 0 && (
				<span className="text-gray-400">+{price.toLocaleString()}원</span>
			)}
		</button>
	);
}

export const SelectOption = {
	Root,
	Label,
	Trigger,
	Sheet,
	Item,
};
