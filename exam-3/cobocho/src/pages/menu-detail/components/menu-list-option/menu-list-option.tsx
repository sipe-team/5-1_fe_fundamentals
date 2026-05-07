import type { ListOption } from '@/domain/catalog/api';
import { VStack, HStack } from '@/shared/components/layout';
import { cn } from '@/shared/lib/cn';

interface MenuListOptionProps {
	option: ListOption;
	selected: string[];
	onToggle: (label: string) => void;
}

export function MenuListOption({ option, selected, onToggle }: MenuListOptionProps) {
	return (
		<VStack gap={2}>
			<HStack justify="between">
				<span className="text-sm font-medium text-gray-700">{option.name}</span>
				<span className="text-xs text-gray-400">
					{selected.length}/{option.maxCount}개
				</span>
			</HStack>
			<VStack gap={1}>
				{option.labels.map((label, i) => (
					<MenuListOptionItem
						key={label}
						label={label}
						price={option.prices[i]}
						isChecked={selected.includes(label)}
						onToggle={() => onToggle(label)}
					/>
				))}
			</VStack>
		</VStack>
	);
}

interface MenuListOptionItemProps {
	label: string;
	price: number;
	isChecked: boolean;
	onToggle: () => void;
}

function MenuListOptionItem({ label, price, isChecked, onToggle }: MenuListOptionItemProps) {
	return (
		<button
			type="button"
			className={cn(
				'flex items-center justify-between rounded-lg border px-4 py-3 text-sm transition-colors',
				isChecked
					? 'border-gray-900 bg-gray-50'
					: 'border-gray-200 hover:border-gray-400',
			)}
			onClick={onToggle}
		>
			<HStack gap={2}>
				<Checkbox checked={isChecked} />
				<span>{label}</span>
			</HStack>
			{price > 0 && (
				<span className="text-gray-400">
					+{price.toLocaleString()}원
				</span>
			)}
		</button>
	);
}

function Checkbox({ checked }: { checked: boolean }) {
	return (
		<span
			className={cn(
				'flex h-5 w-5 items-center justify-center rounded border text-xs',
				checked
					? 'border-gray-900 bg-gray-900 text-white'
					: 'border-gray-300',
			)}
		>
			{checked && '✓'}
		</span>
	);
}
