import { Link } from 'react-router-dom';

import type { MenuItem } from '../../api';
import { VStack } from '@/shared/components/layout';

interface MenuCardProps {
	item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
	return (
		<Link
			to={`/menu/${item.id}`}
			className="block w-full text-left"
		>
			<VStack
				gap={2}
				className="rounded-xl border border-gray-200 p-3"
			>
				<img
					src={item.iconImg}
					alt={item.title}
					className="mx-auto aspect-square w-full object-contain rounded-lg"
				/>
				<span className="text-sm font-medium text-gray-900">{item.title}</span>
				<span className="text-sm text-gray-500">
					{item.price.toLocaleString()}원
				</span>
			</VStack>
		</Link>
	);
}
