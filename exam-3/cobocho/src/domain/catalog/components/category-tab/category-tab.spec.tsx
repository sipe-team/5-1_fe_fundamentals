import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { catalogService } from '@/domain/catalog/api/catalog.service';
import { TestProvider } from '@/test/test-provider';
import { CategoryTab } from './category-tab';

vi.mock('@/domain/catalog/api/catalog.service');

const categories: string[] = ['커피', '음료', '디저트'];

function mockGetCategories(cats: string[] = categories) {
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
				<CategoryTab value="커피" />
			</TestProvider>,
		);

		for (const category of categories) {
			expect(
				await screen.findByRole('tab', { name: category }),
			).toBeInTheDocument();
		}
	});

	it('선택된 카테고리가 활성 상태로 표시된다', async () => {
		render(
			<TestProvider>
				<CategoryTab value="음료" />
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

	it('카테고리를 클릭하면 onSelect가 호출된다', async () => {
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

	it('카테고리가 없을 때 빈 상태를 처리한다', async () => {
		mockGetCategories([]);

		render(
			<TestProvider>
				<CategoryTab value="" />
			</TestProvider>,
		);

		await screen.findByRole('tablist');
		expect(screen.queryByRole('tab')).not.toBeInTheDocument();
	});
});
