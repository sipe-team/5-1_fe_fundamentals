import { Card } from '@/components/card/card';
import { HStack, VStack } from '@/components/layout';
import { CATEGORY_LABELS, type Product } from '../../api/products.types';
import { formatPrice } from '../../libs/format-price';

interface ProductCardProps {
	product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
	return (
		<Card className="overflow-hidden p-0">
			<img
				src={product.imageUrl}
				alt={product.name}
				className="aspect-square w-full object-cover"
			/>
			<VStack gap={1} className="p-3">
				<p className="truncate font-semibold">{product.name}</p>
				<p className="text-sm">{formatPrice(product.price)}</p>
				<HStack justify="between" className="text-xs text-gray-500">
					<span>{CATEGORY_LABELS[product.category]}</span>
					<span>★ {product.rating}</span>
				</HStack>
			</VStack>
		</Card>
	);
};
