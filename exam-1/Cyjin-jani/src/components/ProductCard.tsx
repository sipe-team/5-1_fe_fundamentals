import type { FC } from 'react';
import { getFormattedKRDate, getFormattedKRPrice } from '@/lib/formatters';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: FC<ProductCardProps> = ({
  product: { name, price, category, createdAt, rating, imageUrl },
}) => {
  const formattedPrice = getFormattedKRPrice(price);
  const formattedDate = getFormattedKRDate(createdAt);

  return (
    <div className="flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-2 left-2 text-xs font-medium bg-white/80 backdrop-blur-sm text-gray-600 px-2 py-0.5 rounded-full">
          {category}
        </span>
      </div>

      <div className="flex flex-col gap-1 p-3">
        <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">
          {name}
        </p>

        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-xs text-gray-500">{rating.toFixed(1)}</span>
        </div>

        <div className="flex items-center justify-between mt-1">
          <span className="text-sm font-bold text-gray-900">
            ₩{formattedPrice}
          </span>
          <span className="text-xs text-gray-400">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};
