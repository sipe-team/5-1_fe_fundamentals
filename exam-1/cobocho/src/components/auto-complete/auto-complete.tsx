import type React from 'react';
import { Children, isValidElement, useEffect, useRef, useState } from 'react';

interface AutoCompleteProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSelect'> {
	value: string;
	onChange: (value: string) => void;
	onSelect: (value: string) => void;
	loading?: boolean;
	children: React.ReactNode;
}

export const AutoComplete = ({
	value,
	onChange,
	onSelect,
	loading = false,
	children,
	...props
}: AutoCompleteProps) => {
	const [open, setOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(-1);
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
	}, []);

	const items = Children.toArray(children).filter(
		(child): child is React.ReactElement<AutoCompleteItemProps> =>
			isValidElement<AutoCompleteItemProps>(child),
	);

	const selectItem = (itemValue: string) => {
		onSelect(itemValue);
		setOpen(false);
		setActiveIndex(-1);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!open || items.length === 0) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				setActiveIndex((prev) => (prev + 1) % items.length);
				break;
			case 'ArrowUp':
				e.preventDefault();
				setActiveIndex((prev) => (prev <= 0 ? items.length - 1 : prev - 1));
				break;
			case 'Enter':
				if (activeIndex >= 0) {
					e.preventDefault();
					selectItem(items[activeIndex].props.value);
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
		<div
			ref={containerRef}
			className="relative"
			{...props}
		>
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
			/>
			{loading && (
				<div className="absolute right-2.5 top-1/2 -translate-y-1/2">
					<div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
				</div>
			)}
			{open && items.length > 0 && (
				<div
					role="listbox"
					className="absolute left-0 top-full z-10 mt-1 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
				>
					{items.map((child, index) => {
						const itemValue = child.props.value;
						return (
							<div
								key={itemValue}
								id={`autocomplete-option-${index}`}
								role="option"
								aria-selected={index === activeIndex}
								tabIndex={-1}
								className={`cursor-pointer px-3 py-2 text-sm ${index === activeIndex ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
								onClick={() => selectItem(itemValue)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') selectItem(itemValue);
								}}
							>
								{child}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

interface AutoCompleteItemProps extends React.HTMLAttributes<HTMLDivElement> {
	value: string;
}

export const AutoCompleteItem = ({
	value,
	...props
}: AutoCompleteItemProps) => {
	return <div {...props}>{value}</div>;
};
