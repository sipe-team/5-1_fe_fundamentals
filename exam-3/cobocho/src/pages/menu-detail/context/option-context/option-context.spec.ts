import type { MenuOption } from '@/domain/catalog/api';
import type { Selections } from './option-context.lib';
import {
	validateSelections,
	flattenSelections,
	calcOptionPrice,
} from './option-context.lib';

// ── Mock Options ──

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
	labels: ['연하게', '보통', '진하게', '샷 추가'],
	prices: [0, 0, 0, 500],
};

const listOption: MenuOption = {
	id: 4,
	name: '추가옵션',
	type: 'list',
	required: false,
	minCount: 0,
	maxCount: 3,
	labels: ['바닐라 시럽', '헤이즐넛 시럽', '카라멜 시럽', '휘핑크림', '오트밀크'],
	prices: [300, 300, 300, 500, 500],
};

const requiredListOption: MenuOption = {
	id: 5,
	name: '토핑',
	type: 'list',
	required: false,
	minCount: 1,
	maxCount: 2,
	labels: ['버터', '잼'],
	prices: [0, 0],
};

const sizeOption: MenuOption = {
	id: 2,
	name: '사이즈',
	type: 'grid',
	required: true,
	col: 3,
	labels: ['Small', 'Medium', 'Large'],
	icons: ['S', 'M', 'L'],
	prices: [0, 500, 1000],
};

// ── validateSelections ──

describe('validateSelections', () => {
	it('모든 필수 옵션이 선택되면 null을 반환한다', () => {
		const selections: Selections = { 1: ['HOT'] };
		expect(validateSelections([gridOption], selections)).toBeNull();
	});

	it('필수 grid 옵션이 미선택이면 에러 메시지를 반환한다', () => {
		expect(validateSelections([gridOption], {})).toBe(
			'온도을(를) 선택해주세요',
		);
	});

	it('필수 grid 옵션이 빈 배열이면 에러 메시지를 반환한다', () => {
		const selections: Selections = { 1: [] };
		expect(validateSelections([gridOption], selections)).toBe(
			'온도을(를) 선택해주세요',
		);
	});

	it('선택 사항인 select 옵션은 미선택이어도 통과한다', () => {
		expect(validateSelections([selectOption], {})).toBeNull();
	});

	it('list 옵션이 minCount 미만이면 에러 메시지를 반환한다', () => {
		expect(validateSelections([requiredListOption], { 5: [] })).toBe(
			'토핑을(를) 1개 이상 선택해주세요',
		);
	});

	it('list 옵션이 minCount 이상이면 통과한다', () => {
		const selections: Selections = { 5: ['버터'] };
		expect(validateSelections([requiredListOption], selections)).toBeNull();
	});

	it('여러 옵션 중 첫 번째 실패한 옵션의 에러를 반환한다', () => {
		expect(validateSelections([gridOption, selectOption], {})).toBe(
			'온도을(를) 선택해주세요',
		);
	});
});

// ── flattenSelections ──

describe('flattenSelections', () => {
	it('selections를 배열로 평탄화한다', () => {
		const selections: Selections = {
			1: ['HOT'],
			4: ['바닐라 시럽', '휘핑크림'],
		};

		expect(flattenSelections(selections)).toEqual([
			{ optionId: 1, labels: ['HOT'] },
			{ optionId: 4, labels: ['바닐라 시럽', '휘핑크림'] },
		]);
	});

	it('빈 labels는 제외한다', () => {
		const selections: Selections = { 1: ['HOT'], 3: [] };

		expect(flattenSelections(selections)).toEqual([
			{ optionId: 1, labels: ['HOT'] },
		]);
	});

	it('빈 selections는 빈 배열을 반환한다', () => {
		expect(flattenSelections({})).toEqual([]);
	});
});

// ── calcOptionPrice ──

describe('calcOptionPrice', () => {
	it('선택된 옵션의 추가 금액을 합산한다', () => {
		const selections: Selections = {
			2: ['Large'],
			4: ['바닐라 시럽', '휘핑크림'],
		};

		expect(calcOptionPrice([sizeOption, listOption], selections)).toBe(
			1000 + 300 + 500,
		);
	});

	it('추가 금액이 없는 옵션은 0원이다', () => {
		const selections: Selections = { 1: ['HOT'] };
		expect(calcOptionPrice([gridOption], selections)).toBe(0);
	});

	it('빈 selections는 0원이다', () => {
		expect(calcOptionPrice([gridOption], {})).toBe(0);
	});

	it('존재하지 않는 optionId는 무시한다', () => {
		const selections: Selections = { 999: ['없는옵션'] };
		expect(calcOptionPrice([gridOption], selections)).toBe(0);
	});

	it('존재하지 않는 label은 무시한다', () => {
		const selections: Selections = { 2: ['없는사이즈'] };
		expect(calcOptionPrice([sizeOption], selections)).toBe(0);
	});
});
