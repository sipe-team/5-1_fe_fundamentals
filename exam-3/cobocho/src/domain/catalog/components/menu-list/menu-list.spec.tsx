import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { MenuItem } from '@/domain/catalog/api/catalog.types';
import { catalogService } from '@/domain/catalog/api/catalog.service';
import { TestProvider } from '@/test/test-provider';
import { MenuList } from './menu-list';

vi.mock('@/domain/catalog/api/catalog.service');

const mockItems: MenuItem[] = [
	{
		id: 'espresso',
		category: '커피',
		title: '에스프레소',
		description: '진한 에스프레소',
		price: 3000,
		iconImg: '/images/espresso.png',
		optionIds: [1],
	},
	{
		id: 'latte',
		category: '커피',
		title: '카페라떼',
		description: '부드러운 라떼',
		price: 4500,
		iconImg: '/images/latte.png',
		optionIds: [1],
	},
	{
		id: 'juice',
		category: '음료',
		title: '오렌지주스',
		description: '신선한 주스',
		price: 5000,
		iconImg: '/images/juice.png',
		optionIds: [],
	},
];

describe('MenuList', () => {
	beforeEach(() => {
		vi.mocked(catalogService.getItems).mockResolvedValue({
			items: mockItems,
		});
	});

	it('커피 카테고리만 렌더링한다', async () => {
		render(
			<TestProvider>
				<MenuList category="커피" />
			</TestProvider>,
		);

		expect(await screen.findByText('에스프레소')).toBeInTheDocument();
		expect(screen.getByText('카페라떼')).toBeInTheDocument();
		expect(screen.queryByText('오렌지주스')).not.toBeInTheDocument();
	});

	it('음료 카테고리만 렌더링한다', async () => {
		render(
			<TestProvider>
				<MenuList category="음료" />
			</TestProvider>,
		);

		expect(await screen.findByText('오렌지주스')).toBeInTheDocument();
		expect(screen.queryByText('에스프레소')).not.toBeInTheDocument();
		expect(screen.queryByText('카페라떼')).not.toBeInTheDocument();
	});

	it('해당 카테고리에 메뉴가 없으면 카드가 렌더링되지 않는다', async () => {
		render(
			<TestProvider>
				<MenuList category="디저트" />
			</TestProvider>,
		);

		// Suspense 해소 대기
		await vi.waitFor(() => {
			expect(screen.queryByRole('button')).not.toBeInTheDocument();
		});
	});

	it('메뉴 카드를 클릭하면 onClickMenu가 호출된다', async () => {
		const user = userEvent.setup();
		const onClickMenu = vi.fn();

		render(
			<TestProvider>
				<MenuList category="커피" onClickMenu={onClickMenu} />
			</TestProvider>,
		);

		await user.click(await screen.findByText('에스프레소'));

		expect(onClickMenu).toHaveBeenCalledWith(
			expect.objectContaining({ id: 'espresso' }),
		);
	});
});
