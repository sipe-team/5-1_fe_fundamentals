import type React from 'react';
import { Children, createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

interface AutoCompleteContextValue {
	value: string;
	open: boolean;
	activeIndex: number;
	itemCount: number;
	onChange: (value: string) => void;
	onSelect: (value: string) => void;
	setOpen: (open: boolean) => void;
	setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
	registerItem: () => number;
	unregisterItem: () => void;
}

const AutoCompleteContext = createContext<AutoCompleteContextValue | null>(null);

const useAutoCompleteContext = () => {
	const context = useContext(AutoCompleteContext);
	if (!context) {
		throw new Error(
			'AutoComplete 컴포넌트는 AutoComplete.Root 내부에서 사용해야 합니다.',
		);
	}
	return context;
};

interface AutoCompleteProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSelect'> {
	value: string;
	onChange: (value: string) => void;
	onSelect: (value: string) => void;
	onOpenChange?: (open: boolean) => void;
	children: React.ReactNode;
}

const AutoComplete = ({
	value,
	onChange,
	onSelect,
	onOpenChange,
	children,
	...props
}: AutoCompleteProps) => {
	const [open, _setOpen] = useState(false);
	const onOpenChangeRef = useRef(onOpenChange);
	onOpenChangeRef.current = onOpenChange;
	const setOpen = useCallback((next: boolean) => {
		_setOpen(next);
		onOpenChangeRef.current?.(next);
	}, []);
	const [activeIndex, setActiveIndex] = useState(-1);
	const itemCountRef = useRef(0);
	const [itemCount, setItemCount] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [setOpen]);

	const selectItem = (itemValue: string) => {
		onSelect(itemValue);
		setOpen(false);
		setActiveIndex(-1);
	};

	const registerItem = () => {
		const index = itemCountRef.current;
		itemCountRef.current += 1;
		setItemCount(itemCountRef.current);
		return index;
	};

	const unregisterItem = () => {
		itemCountRef.current -= 1;
		setItemCount(itemCountRef.current);
	};

	return (
		<AutoCompleteContext.Provider
			value={{
				value,
				open,
				activeIndex,
				itemCount,
				onChange,
				onSelect: selectItem,
				setOpen,
				setActiveIndex,
				registerItem,
				unregisterItem,
			}}
		>
			<div
				ref={containerRef}
				className="relative"
				{...props}
			>
				{children}
			</div>
		</AutoCompleteContext.Provider>
	);
};

interface AutoCompleteInputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
	loading?: boolean;
}

const AutoCompleteInput = ({ loading = false, ...props }: AutoCompleteInputProps) => {
	const { value, open, activeIndex, itemCount, onChange, setOpen, setActiveIndex, onSelect } =
		useAutoCompleteContext();

	const scrollToIndex = (index: number) => {
		const el = document.getElementById(`autocomplete-option-${index}`);
		el?.scrollIntoView?.({ block: 'nearest' });
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!open || itemCount === 0) return;

		switch (e.key) {
			case 'ArrowDown': {
				e.preventDefault();
				const next = (activeIndex + 1) % itemCount;
				setActiveIndex(next);
				scrollToIndex(next);
				break;
			}
			case 'ArrowUp': {
				e.preventDefault();
				const prev = activeIndex <= 0 ? itemCount - 1 : activeIndex - 1;
				setActiveIndex(prev);
				scrollToIndex(prev);
				break;
			}
			case 'Enter':
				if (activeIndex >= 0) {
					e.preventDefault();
					const activeEl = document.getElementById(
						`autocomplete-option-${activeIndex}`,
					);
					if (activeEl?.dataset.value) {
						onSelect(activeEl.dataset.value);
					}
				}
				break;
			case 'Escape':
				e.preventDefault();
				setOpen(false);
				setActiveIndex(-1);
				break;
		}
	};

	return (
		<div className="relative">
			<input
				value={value}
				onChange={(e) => {
					onChange(e.target.value);
					setActiveIndex(-1);
				}}
				onFocus={() => setOpen(true)}
				onKeyDown={handleKeyDown}
				role="combobox"
				aria-expanded={open}
				aria-activedescendant={
					activeIndex >= 0 ? `autocomplete-option-${activeIndex}` : undefined
				}
				placeholder="검색어를 입력하세요"
				className="w-full rounded-md border border-gray-300 px-3 py-2 pr-8 text-sm outline-none transition-colors focus:border-black"
				{...props}
			/>
			{loading && (
				<div className="absolute right-2.5 top-1/2 -translate-y-1/2">
					<div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
				</div>
			)}
		</div>
	);
};

const AutoCompleteContent = ({ children }: { children: React.ReactNode }) => {
	const { open } = useAutoCompleteContext();

	if (!open || Children.count(children) === 0) return null;

	return (
		<div
			role="listbox"
			className="absolute left-0 top-full z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg"
		>
			{children}
		</div>
	);
};

interface AutoCompleteItemProps extends React.HTMLAttributes<HTMLDivElement> {
	value: string;
}

const AutoCompleteItem = ({ value, ...props }: AutoCompleteItemProps) => {
	const { activeIndex, onSelect, registerItem, unregisterItem } =
		useAutoCompleteContext();
	const indexRef = useRef(-1);

	useEffect(() => {
		indexRef.current = registerItem();
		return () => unregisterItem();
	}, [registerItem, unregisterItem]);

	const index = indexRef.current;

	return (
		<div
			id={`autocomplete-option-${index}`}
			role="option"
			aria-selected={index === activeIndex}
			data-value={value}
			tabIndex={-1}
			className={`cursor-pointer px-3 py-2 text-sm ${index === activeIndex ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
			onClick={() => onSelect(value)}
			onKeyDown={(e) => {
				if (e.key === 'Enter') onSelect(value);
			}}
			{...props}
		>
			{value}
		</div>
	);
};

export {
	AutoComplete,
	AutoCompleteInput,
	AutoCompleteContent,
	AutoCompleteItem,
};
