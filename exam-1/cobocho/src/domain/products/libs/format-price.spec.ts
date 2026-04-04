import { formatPrice } from './format-price';

describe('formatPrice', () => {
	it('천 단위 콤마와 원 단위를 붙여 포맷팅한다', () => {
		expect(formatPrice(129000)).toBe('129,000원');
	});

	it('0원을 포맷팅한다', () => {
		expect(formatPrice(0)).toBe('0원');
	});

	it('백만 단위 가격을 포맷팅한다', () => {
		expect(formatPrice(1500000)).toBe('1,500,000원');
	});

	it('천 단위 미만 가격은 콤마 없이 포맷팅한다', () => {
		expect(formatPrice(500)).toBe('500원');
	});
});
