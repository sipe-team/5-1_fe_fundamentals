import { render, screen } from '@testing-library/react';
import type { Product } from '../../api/products.types';
import { ProductCard } from './product-card';

const createProduct = (overrides: Partial<Product> = {}): Product => ({
	id: 1,
	name: '나이키 에어맥스',
	price: 129000,
	category: 'shoes',
	imageUrl: 'https://picsum.photos/200',
	createdAt: '2026-01-15T00:00:00Z',
	rating: 4.5,
	...overrides,
});

describe('ProductCard', () => {
	it('상품 이미지를 렌더링한다', () => {
		const product = createProduct();
		render(<ProductCard product={product} />);

		const img = screen.getByRole('img', { name: product.name });
		expect(img).toHaveAttribute('src', product.imageUrl);
	});

	it('상품명을 렌더링한다', () => {
		const product = createProduct({ name: '아디다스 울트라부스트' });
		render(<ProductCard product={product} />);

		expect(screen.getByText('아디다스 울트라부스트')).toBeInTheDocument();
	});

	it('가격을 포맷팅하여 렌더링한다', () => {
		const product = createProduct({ price: 129000 });
		render(<ProductCard product={product} />);

		expect(screen.getByText('129,000원')).toBeInTheDocument();
	});

	it('카테고리를 한글 라벨로 렌더링한다', () => {
		const product = createProduct({ category: 'tops' });
		render(<ProductCard product={product} />);

		expect(screen.getByText('상의')).toBeInTheDocument();
	});

	it('평점을 렌더링한다', () => {
		const product = createProduct({ rating: 4.5 });
		render(<ProductCard product={product} />);

		expect(screen.getByText('★ 4.5')).toBeInTheDocument();
	});

});
