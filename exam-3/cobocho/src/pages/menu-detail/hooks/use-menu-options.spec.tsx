import { renderHook } from '@testing-library/react';
import type { MenuItem, MenuOption } from '@/domain/catalog/api/catalog.types';
import { catalogService } from '@/domain/catalog/api/catalog.service';
import { TestProvider } from '@/test/test-provider';
import { useMenuOptions } from './use-menu-options';

vi.mock('@/domain/catalog/api/catalog.service');

const gridOption: MenuOption = {
	id: 1,
	name: '온도',
	type: 'grid',
	required: true,
	col: 2,
	labels: ['HOT', 'ICE'],
	icons: ['🔥', '🧊'],
	prices: [0, 0],
};

const selectOption: MenuOption = {
	id: 3,
	name: '진하기',
	type: 'select',
	required: false,
	labels: ['연하게', '보통'],
	prices: [0, 0],
};

const listOption: MenuOption = {
	id: 4,
	name: '추가옵션',
	type: 'list',
	required: false,
	minCount: 0,
	maxCount: 3,
	labels: ['바닐라 시럽'],
	prices: [300],
};

const allOptions: MenuOption[] = [gridOption, selectOption, listOption];

const mockItem: MenuItem = {
	id: 'espresso',
	category: '커피',
	title: '에스프레소',
	description: '진한 에스프레소',
	price: 3000,
	iconImg: '/images/espresso.png',
	optionIds: [1, 4],
};

function setup(item: MenuItem = mockItem, options: MenuOption[] = allOptions) {
	vi.mocked(catalogService.getItem).mockResolvedValue({ item });
	vi.mocked(catalogService.getOptions).mockResolvedValue({ options });
}

describe('useMenuOptions', () => {
	it('아이템과 해당 옵션만 반환한다', async () => {
		setup();

		const { result } = renderHook(() => useMenuOptions('espresso'), {
			wrapper: TestProvider,
		});

		await vi.waitFor(() => {
			expect(result.current.item.id).toBe('espresso');
		});

		expect(result.current.options).toHaveLength(2);
		expect(result.current.options[0].id).toBe(1);
		expect(result.current.options[1].id).toBe(4);
	});

	it('optionIds 순서대로 옵션을 반환한다', async () => {
		const item: MenuItem = { ...mockItem, optionIds: [4, 1] };
		setup(item);

		const { result } = renderHook(() => useMenuOptions('espresso'), {
			wrapper: TestProvider,
		});

		await vi.waitFor(() => {
			expect(result.current.options).toHaveLength(2);
		});

		expect(result.current.options[0].id).toBe(4);
		expect(result.current.options[1].id).toBe(1);
	});

	it('존재하지 않는 optionId는 무시한다', async () => {
		const item: MenuItem = { ...mockItem, optionIds: [1, 999] };
		setup(item);

		const { result } = renderHook(() => useMenuOptions('espresso'), {
			wrapper: TestProvider,
		});

		await vi.waitFor(() => {
			expect(result.current.options).toHaveLength(1);
		});

		expect(result.current.options[0].id).toBe(1);
	});

	it('optionIds가 비어있으면 빈 배열을 반환한다', async () => {
		const item: MenuItem = { ...mockItem, optionIds: [] };
		setup(item);

		const { result } = renderHook(() => useMenuOptions('espresso'), {
			wrapper: TestProvider,
		});

		await vi.waitFor(() => {
			expect(result.current.options).toHaveLength(0);
		});
	});
});
