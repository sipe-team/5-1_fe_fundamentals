import type { MenuOption } from '@/domain/catalog/api';

export type Selections = Record<number, string[]>;

/**
 * 필수 옵션 검증. 유효하면 null, 아니면 에러 메시지 반환.
 */
export function validateSelections(
	options: MenuOption[],
	selections: Selections,
): string | null {
	for (const option of options) {
		const selected = selections[option.id] ?? [];
		const errorMessage = validateOption(option, selected);
		if (errorMessage) return errorMessage;
	}
	return null;
}

function validateOption(option: MenuOption, selected: string[]): string | null {
	const isEmpty = selected.length === 0;
	const isRequired = option.required || option.type === 'grid';

	if (isRequired && isEmpty) {
		return `${option.name}을(를) 선택해주세요`;
	}

	if (option.type === 'list' && selected.length < option.minCount) {
		return `${option.name}을(를) ${option.minCount}개 이상 선택해주세요`;
	}

	return null;
}

/**
 * Record 형태의 selections를 { optionId, labels }[] 배열로 평탄화.
 */
export function flattenSelections(
	selections: Selections,
): { optionId: number; labels: string[] }[] {
	return Object.entries(selections)
		.filter(([, labels]) => labels.length > 0)
		.map(([id, labels]) => ({ optionId: Number(id), labels }));
}

/**
 * 선택된 옵션의 추가 금액 합산.
 */
export function calcOptionPrice(
	options: MenuOption[],
	selections: Selections,
): number {
	return Object.entries(selections).reduce((total, [optionId, labels]) => {
		const option = options.find((o) => o.id === Number(optionId));
		if (!option) return total;

		return total + calcLabelsPrice(option, labels);
	}, 0);
}

function calcLabelsPrice(option: MenuOption, labels: string[]): number {
	return labels.reduce((sum, label) => {
		const index = option.labels.indexOf(label);
		return index !== -1 ? sum + option.prices[index] : sum;
	}, 0);
}
