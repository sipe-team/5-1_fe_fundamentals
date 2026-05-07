import type { MenuItem } from '@/domain/catalog/api';
import { VStack } from '@/shared/components/layout';

interface MenuInfoProps {
	item: MenuItem;
}

export function MenuInfo({ item }: MenuInfoProps) {
	return (
		<VStack
			gap={3}
			align="center"
			className="pt-4"
		>
			<img
				src={item.iconImg}
				alt={item.title}
				className="mx-auto aspect-square w-full object-contain rounded-xl"
			/>
			<h1 className="text-xl font-bold text-gray-900">{item.title}</h1>
			<p className="text-sm text-gray-500">{item.description}</p>
			<span className="text-lg font-semibold">
				{item.price.toLocaleString()}원
			</span>
		</VStack>
	);
}
