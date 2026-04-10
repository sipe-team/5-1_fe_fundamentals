import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { MenuItem } from '@/domain/catalog/api/catalog.types';
import { TestProvider } from '@/test/test-provider';
import { MenuCard } from './menu-card';

const mockItem: MenuItem = {
	id: 'espresso',
	category: '커피',
	title: '에스프레소',
	description: '진한 에스프레소',
	price: 3000,
	iconImg: '/images/espresso.png',
	optionIds: [1],
};

describe('MenuCard', () => {
	it('메뉴 이름과 가격을 렌더링한다', () => {
		render(
			<TestProvider>
				<MenuCard item={mockItem} />
			</TestProvider>,
		);

		expect(screen.getByText('에스프레소')).toBeInTheDocument();
		expect(screen.getByText('3,000원')).toBeInTheDocument();
	});

	it('이미지를 렌더링한다', () => {
		render(
			<TestProvider>
				<MenuCard item={mockItem} />
			</TestProvider>,
		);

		const img = screen.getByRole('img', { name: '에스프레소' });
		expect(img).toHaveAttribute('src', '/images/espresso.png');
	});

	it('클릭하면 onClick이 호출된다', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();

		render(
			<TestProvider>
				<MenuCard item={mockItem} onClick={onClick} />
			</TestProvider>,
		);

		await user.click(screen.getByRole('button'));

		expect(onClick).toHaveBeenCalledWith(mockItem);
	});

	it('onClick이 없어도 렌더링된다', async () => {
		const user = userEvent.setup();

		render(
			<TestProvider>
				<MenuCard item={mockItem} />
			</TestProvider>,
		);

		await user.click(screen.getByRole('button'));

		expect(screen.getByText('에스프레소')).toBeInTheDocument();
	});
});
