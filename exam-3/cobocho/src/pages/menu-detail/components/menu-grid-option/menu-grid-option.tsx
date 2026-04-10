import type { GridOption } from '@/domain/catalog/api';
import type { GridProps } from '@/shared/components/layout/grid';
import { VStack } from '@/shared/components/layout';
import { Grid } from '@/shared/components/layout';
import { cn } from '@/shared/lib/cn';

interface MenuGridOptionProps {
	option: GridOption;
	selected: string | null;
	onSelect: (label: string) => void;
}

export function MenuGridOption({ option, selected, onSelect }: MenuGridOptionProps) {
	return (
		<VStack gap={2}>
			<span className="text-sm font-medium text-gray-700">{option.name}</span>
			<Grid cols={option.col as GridProps['cols']} gap={2}>
				{option.labels.map((label, i) => (
					<MenuGridOptionItem
						key={label}
						icon={option.icons[i]}
						label={label}
						price={option.prices[i]}
						isSelected={selected === label}
						onSelect={() => onSelect(label)}
					/>
				))}
			</Grid>
		</VStack>
	);
}

interface MenuGridOptionItemProps {
	icon: string;
	label: string;
	price: number;
	isSelected: boolean;
	onSelect: () => void;
}

function MenuGridOptionItem({ icon, label, price, isSelected, onSelect }: MenuGridOptionItemProps) {
	return (
		<button
			type="button"
			className={cn(
				'flex flex-col items-center gap-1 rounded-lg border p-3 text-sm transition-colors',
				isSelected
					? 'border-gray-900 bg-gray-900 text-white'
					: 'border-gray-200 bg-white text-gray-700 hover:border-gray-400',
			)}
			onClick={onSelect}
		>
			<span className="text-lg">{icon}</span>
			<span>{label}</span>
			{price > 0 && (
				<span className={cn('text-xs', isSelected ? 'text-gray-300' : 'text-gray-400')}>
					+{price.toLocaleString()}원
				</span>
			)}
		</button>
	);
}
