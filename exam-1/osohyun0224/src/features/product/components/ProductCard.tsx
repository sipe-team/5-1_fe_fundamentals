import { CATEGORY_LABELS } from '@/shared/constants/product';
import type { Product } from '@/types';

function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR') + '원';
}

function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '☆' : '') + '☆'.repeat(empty);
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-image-wrapper">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        <span className="product-category-badge">
          {CATEGORY_LABELS[product.category]}
        </span>
      </div>
      <div className="product-info">
        <h3 className="product-name" title={product.name}>
          {product.name}
        </h3>
        <p className="product-price">{formatPrice(product.price)}</p>
        <div className="product-rating">
          <span className="stars">{renderStars(product.rating)}</span>
          <span className="rating-value">{product.rating.toFixed(1)}</span>
        </div>
      </div>
    </article>
  );
}
