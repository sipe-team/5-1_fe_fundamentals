import { HStack } from '@/shared/components/layout';

interface NumericInputProps {
	value: number;
	min?: number;
	max?: number;
	onChange: (value: number) => void;
}

const DEFAULT_MIN = 1;
const DEFAULT_MAX = 99;

export function NumericInput({
	value,
	min = DEFAULT_MIN,
	max = DEFAULT_MAX,
	onChange,
}: NumericInputProps) {
	return (
		<HStack gap={3}>
			<button
				type="button"
				className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 disabled:opacity-30"
				disabled={value <= min}
				onClick={() => onChange(value - 1)}
			>
				-
			</button>
			<span className="w-8 text-center text-sm font-medium">{value}</span>
			<button
				type="button"
				className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 disabled:opacity-30"
				disabled={value >= max}
				onClick={() => onChange(value + 1)}
			>
				+
			</button>
		</HStack>
	);
}
