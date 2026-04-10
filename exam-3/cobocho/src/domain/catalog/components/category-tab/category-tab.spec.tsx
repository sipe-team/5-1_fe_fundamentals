import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { MenuCategory } from '@/domain/catalog/api/catalog.types';
import { catalogService } from '@/domain/catalog/api/catalog.service';
import { TestProvider } from '@/test/test-provider';
import { CategoryTab } from './category-tab';

vi.mock('@/domain/catalog/api/catalog.service');

const categories: MenuCategory[] = ['커피', '음료', '디저트'];

function mockGetCategories(cats: MenuCategory[] = categories) {
	vi.mocked(catalogService.getCategories).mockResolvedValue({
		categories: cats,
	});
}

describe('CategoryTab', () => {
	beforeEach(() => {
		mockGetCategories();
	});

	it('카테고리 목록을 렌더링한다', async () => {
		render(
			<TestProvider>
				<CategoryTab value="커피" onSelect={vi.fn()} />
			</TestProvider>,
		);

		for (const category of categories) {
			expect(
				await screen.findByRole('tab', { name: category }),
			).toBeInTheDocument();
		}
	});

	it('현재 선택된 카테고리가 활성 상태로 표시된다', async () => {
		render(
			<TestProvider>
				<CategoryTab value="음료" onSelect={vi.fn()} />
			</TestProvider>,
		);

		expect(
			await screen.findByRole('tab', { name: '음료' }),
		).toHaveAttribute('aria-selected', 'true');
		expect(screen.getByRole('tab', { name: '커피' })).toHaveAttribute(
			'aria-selected',
			'false',
		);
	});

	it('카테고리를 클릭하면 onSelect 콜백이 호출된다', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();
		render(
			<TestProvider>
				<CategoryTab value="커피" onSelect={onSelect} />
			</TestProvider>,
		);

		await user.click(await screen.findByRole('tab', { name: '디저트' }));

		expect(onSelect).toHaveBeenCalledWith('디저트');
	});

	it('카테고리를 클릭하면 활성 상태가 변경된다', async () => {
		const user = userEvent.setup();
		let selected: MenuCategory = '커피';
		const onSelect = (category: MenuCategory) => {
			selected = category;
		};

		const { rerender } = render(
			<TestProvider>
				<CategoryTab value={selected} onSelect={onSelect} />
			</TestProvider>,
		);

		await user.click(await screen.findByRole('tab', { name: '디저트' }));

		rerender(
			<TestProvider>
				<CategoryTab value={selected} onSelect={onSelect} />
			</TestProvider>,
		);

		expect(screen.getByRole('tab', { name: '디저트' })).toHaveAttribute(
			'aria-selected',
			'true',
		);
	});

	it('카테고리가 없을 때 빈 상태를 처리한다', async () => {
		mockGetCategories([]);
		render(
			<TestProvider>
				<CategoryTab value="커피" onSelect={vi.fn()} />
			</TestProvider>,
		);

		await screen.findByRole('tablist');
		expect(screen.queryByRole('tab')).not.toBeInTheDocument();
	});

	it('value prop으로 전달된 카테고리가 초기 선택 상태로 반영된다', async () => {
		render(
			<TestProvider>
				<CategoryTab value="디저트" onSelect={vi.fn()} />
			</TestProvider>,
		);

		expect(
			await screen.findByRole('tab', { name: '디저트' }),
		).toHaveAttribute('aria-selected', 'true');
		expect(screen.getByRole('tab', { name: '커피' })).toHaveAttribute(
			'aria-selected',
			'false',
		);
		expect(screen.getByRole('tab', { name: '음료' })).toHaveAttribute(
			'aria-selected',
			'false',
		);
	});

	it('value가 없으면 첫 번째 카테고리가 선택된다', async () => {
		render(
			<TestProvider>
				<CategoryTab />
			</TestProvider>,
		);

		expect(
			await screen.findByRole('tab', { name: '커피' }),
		).toHaveAttribute('aria-selected', 'true');
	});

	it('onSelect가 없어도 렌더링된다', async () => {
		const user = userEvent.setup();
		render(
			<TestProvider>
				<CategoryTab value="커피" />
			</TestProvider>,
		);

		await user.click(await screen.findByRole('tab', { name: '음료' }));

		expect(screen.getByRole('tab', { name: '음료' })).toBeInTheDocument();
	});

	it('유효하지 않은 카테고리가 전달되면 첫 번째 카테고리가 선택된다', async () => {
		render(
			<TestProvider>
				<CategoryTab
					value={'invalid' as MenuCategory}
					onSelect={vi.fn()}
				/>
			</TestProvider>,
		);

		expect(
			await screen.findByRole('tab', { name: '커피' }),
		).toHaveAttribute('aria-selected', 'true');
	});

	it('외부에서 value가 변경되면 활성 카테고리가 업데이트된다', async () => {
		const { rerender } = render(
			<TestProvider>
				<CategoryTab value="커피" onSelect={vi.fn()} />
			</TestProvider>,
		);

		expect(
			await screen.findByRole('tab', { name: '커피' }),
		).toHaveAttribute('aria-selected', 'true');

		rerender(
			<TestProvider>
				<CategoryTab value="음료" onSelect={vi.fn()} />
			</TestProvider>,
		);

		expect(screen.getByRole('tab', { name: '음료' })).toHaveAttribute(
			'aria-selected',
			'true',
		);
		expect(screen.getByRole('tab', { name: '커피' })).toHaveAttribute(
			'aria-selected',
			'false',
		);
	});
});
