import type React from 'react';
import { Children, isValidElement, useEffect, useRef, useState } from 'react';

interface AutoCompleteProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSelect'> {
	value: string;
	onChange: (value: string) => void;
	onSelect: (value: string) => void;
	children: React.ReactNode;
}

export const AutoComplete = ({
	value,
	onChange,
	onSelect,
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
			/>
			{open && items.length > 0 && (
				<div
					role="listbox"
					className="absolute left-0 top-full z-10 w-full bg-white shadow-md"
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
								className={index === activeIndex ? 'bg-gray-100' : ''}
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
