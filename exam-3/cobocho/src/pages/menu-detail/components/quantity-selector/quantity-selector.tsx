import { HStack } from '@/shared/components/layout';

interface QuantitySelectorProps {
	quantity: number;
	min?: number;
	max?: number;
	onChange: (quantity: number) => void;
}

const DEFAULT_MAX_QUANTITY = 99;

const DEFAULT_MIN_QUANTITY = 1;

export function QuantitySelector({
	quantity,
	min = DEFAULT_MIN_QUANTITY,
	max = DEFAULT_MAX_QUANTITY,
	onChange,
}: QuantitySelectorProps) {
	return (
		<HStack
			justify="between"
			className="py-2"
		>
			<span className="text-sm font-medium text-gray-700">수량</span>
			<HStack gap={3}>
				<button
					type="button"
					className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 disabled:opacity-30"
					disabled={quantity <= min}
					onClick={() => onChange(quantity - 1)}
				>
					-
				</button>
				<span className="w-8 text-center text-sm font-medium">{quantity}</span>
				<button
					type="button"
					className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 disabled:opacity-30"
					disabled={quantity >= max}
					onClick={() => onChange(quantity + 1)}
				>
					+
				</button>
			</HStack>
		</HStack>
	);
}
