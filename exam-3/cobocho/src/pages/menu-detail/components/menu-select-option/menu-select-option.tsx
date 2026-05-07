import { useState } from 'react';
import type { SelectOption } from '@/domain/catalog/api';
import { VStack } from '@/shared/components/layout';
import { BottomSheet } from '@/shared/components/bottom-sheet';
import { cn } from '@/shared/lib/cn';

interface MenuSelectOptionProps {
	option: SelectOption;
	selected: string | null;
	onSelect: (label: string | null) => void;
}

export function MenuSelectOption({ option, selected, onSelect }: MenuSelectOptionProps) {
	const [open, setOpen] = useState(false);

	return (
		<VStack gap={2}>
			<span className="text-sm font-medium text-gray-700">{option.name}</span>

			<BottomSheet.Root open={open} onOpenChange={setOpen}>
				<BottomSheet.Trigger asChild>
					<button
						type="button"
						className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm"
					>
						<span className={selected ? 'text-gray-900' : 'text-gray-400'}>
							{selected ?? `${option.name} 선택`}
						</span>
						<span className="text-gray-400">▼</span>
					</button>
				</BottomSheet.Trigger>

				<BottomSheet.Content>
					<BottomSheet.Title>{option.name}</BottomSheet.Title>
					<VStack gap={1}>
						{option.labels.map((label, i) => (
							<MenuSelectOptionItem
								key={label}
								label={label}
								price={option.prices[i]}
								isSelected={selected === label}
								onSelect={() => {
									onSelect(label);
									setOpen(false);
								}}
							/>
						))}
					</VStack>
				</BottomSheet.Content>
			</BottomSheet.Root>
		</VStack>
	);
}

interface MenuSelectOptionItemProps {
	label: string;
	price: number;
	isSelected: boolean;
	onSelect: () => void;
}

function MenuSelectOptionItem({ label, price, isSelected, onSelect }: MenuSelectOptionItemProps) {
	return (
		<button
			type="button"
			className={cn(
				'flex items-center justify-between rounded-lg px-4 py-3 text-sm',
				isSelected
					? 'bg-gray-100 font-medium text-gray-900'
					: 'text-gray-600 hover:bg-gray-50',
			)}
			onClick={onSelect}
		>
			<span>{label}</span>
			{price > 0 && (
				<span className="text-gray-400">
					+{price.toLocaleString()}원
				</span>
			)}
		</button>
	);
}
